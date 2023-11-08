import { Settings } from "@root/global/Settings";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import pino from "pino";
import { inject, injectable } from "tsyringe";
import { InferType, object, string } from "yup";
import { AdminInteractor } from "../interactors/Admin";
import { MemberInteractor } from "../interactors/Member";
import { ZoomAppVersion, ZoomAuthFactory } from "../services/ZoomAuth";
import crypto from "crypto";
import { ZoomVersions } from "@root/global/ZoomCredentialManager";

const deauthorizationValidator = object({
  event: string()
    .matches(/app_deauthorized/)
    .required(),
  payload: object({
    account_id: string().required(),
    user_id: string().required(),
    signature: string().required(),
    deauthorization_time: string().required(),
    client_id: string().required(),
  }).required(),
});

const generateCodeVerifier = () => {
  return crypto.randomBytes(64).toString("hex");
};

type DeauthorizationBody = InferType<typeof deauthorizationValidator>;

const isDeauthorizationBody = (body: unknown): body is DeauthorizationBody =>
  deauthorizationValidator.isType(body);

@injectable()
export class ZoomAuthRouter {
  constructor(
    private zoomAuthFactory: ZoomAuthFactory,
    private settings: Settings,
    private member: MemberInteractor,
    private admin: AdminInteractor,
    @inject("Logger") private logger: pino.Logger
  ) {}

  plugin = async (app: FastifyInstance) => {
    app.get("/zoom/connect", this.makeCreateAuth(""));
    app.get("/zoom/signup", this.makeHandleZoomSignup(""));
    app.get("/zoom/auth/code", this.makeHandleAuthCode(""));
    app.get("/zoom/deauthorize", this.makeHandleDeauthorize(""));

    app.get("/zoom/v2/connect", this.makeCreateAuth("V2"));
    app.get("/zoom/v2/signup", this.makeHandleZoomSignup("V2"));
    app.get("/zoom/v2/auth/code", this.makeHandleAuthCode("V2"));
    app.get("/zoom/v2/deauthorize", this.makeHandleDeauthorize("V2"));

    app.post("/zoom/pkce/challenge", this.handleCreatePKCEChallenge);
    return;
  };

  makeCreateAuth =
    (version: "" | "V2") =>
    async (
      request: FastifyRequest<{
        Querystring: { state?: "import"; redirect?: string };
      }>,
      reply: FastifyReply
    ) => {
      const enforceV2 = this.settings.getSetting("enforceZoomV2");
      if (version === "" && enforceV2) {
        return reply.redirect(301, "/zoom/v2/connect");
      }
      const zoomAuth = this.zoomAuthFactory.getZoomAuth(version);
      const state: Record<string, string | boolean> = {};

      if (request.query.state) {
        state.import = true;
      }

      if (request.query.redirect) {
        state.redirect = request.query.redirect;
      }

      const url =
        Object.keys(state).length > 0
          ? zoomAuth.getZoomAuthorizationUrl() +
            `&state=${encodeURIComponent(JSON.stringify(state))}`
          : zoomAuth.getZoomAuthorizationUrl();

      reply.redirect(url);
    };

  makeHandleZoomSignup =
    (version: ZoomVersions) =>
    async (
      request: FastifyRequest<{ Querystring: { redirect?: string } }>,
      reply: FastifyReply
    ) => {
      const enforceV2 = this.settings.getSetting("enforceZoomV2");
      if (version === "" && enforceV2) {
        return reply.redirect(301, "/zoom/v2/signup");
      }
      const zoomAuth = this.zoomAuthFactory.getZoomAuth(version);
      const state: Record<string, string | boolean> = {
        signup: true,
      };
      if (request.query.redirect) {
        state.redirect = request.query.redirect;
      }

      const url =
        zoomAuth.getZoomAuthorizationUrl() +
        `&state=${encodeURIComponent(JSON.stringify(state))}`;

      reply.redirect(url);
    };

  makeHandleDeauthorize =
    (version: ZoomVersions) =>
    async (request: FastifyRequest<{ Body: DeauthorizationBody }>) => {
      const zoomAuth = this.zoomAuthFactory.getZoomAuth(version);
      this.logger.debug("Received video ready webhook from Zoom");
      const data = request.body;
      const signature = request.headers["x-zm-signature"];
      const timestamp = request.headers["x-zm-request-timestamp"];

      const messageString = `v0:${timestamp}:${request.rawBody}`;

      const secret = zoomAuth.getVerificationSecret();

      if (!secret) {
        throw new Error("zoom verification secret not set");
      }

      if (!isDeauthorizationBody(data) || !signature) {
        this.logger.error("Invalid webhook received from Zoom");
        throw new Error("invalid webhook format");
      }

      const hashedMessage = crypto
        .createHmac("sha256", secret)
        .update(messageString)
        .digest("hex");

      if (signature !== `v0=${hashedMessage}`) {
        this.logger.error("Invalid webhook received from Zoom");
        throw new Error("webhook signature is invalid");
      }

      this.logger.debug("Webhook signature is valid");

      await zoomAuth.deleteUserAuth(request.body.payload.user_id);

      return;
    };

  makeHandleAuthCode =
    (version: ZoomAppVersion) =>
    async (
      request: FastifyRequest<{
        Querystring: { code: string; state?: string; tokenRedirect?: string };
      }>,
      reply: FastifyReply
    ) => {
      const versionPath = version === "" ? "" : `/${version}`;
      const zoomAuth = this.zoomAuthFactory.getZoomAuth(version);
      const code = request.query.code;
      const codeVerifier = request.session.get<string | undefined>(
        "codeVerifier"
      );

      const state = JSON.parse(decodeURIComponent(request.query.state || "{}"));

      const userId = request.session.get<string | undefined>("userId");
      const auth = await zoomAuth.getAuthTokenFromCode(
        code,
        codeVerifier,
        request.query.tokenRedirect
      );

      if (!userId) {
        const identity = await zoomAuth.getUserIdentityByToken(auth.authToken);

        const user = await this.member.maybeFindUserByIdentity(identity);

        if (user) {
          await zoomAuth.storeUserAuth(
            {
              ...auth,
              expiresAt: new Date(auth.expiresAt),
              type: zoomAuth.getZoomType(),
            },
            user.id
          );
          request.session.set("userId", user.id);
          await request.session.save();

          if (state.redirect) {
            const redirectUrl =
              state.redirect[0] === "/" ? state.redirect : `/${state.redirect}`;
            return reply.redirect(redirectUrl);
          }

          return reply.redirect("/");
        }

        if (state.signup) {
          const signup = await zoomAuth.getSignupDetails(auth.authToken);

          const maybeUser = await this.member.getUserByEmail(signup.email);

          // If an account already exists with the zoom user's email, then
          // they must connect the accounts by logging in with email
          if (maybeUser) {
            return reply.redirect(
              `/connect-zoom-account?redirect=${encodeURIComponent(
                `zoom${versionPath}/connect`
              )}`
            );
          }

          const inviteToken = request.session.get<string | undefined>(
            "inviteToken"
          );

          const newUser = await this.admin.signup(signup, inviteToken, true);

          await zoomAuth.storeUserAuth(
            {
              ...auth,
              expiresAt: new Date(auth.expiresAt),
              type: zoomAuth.getZoomType(),
            },
            newUser.id
          );
          request.session.set("userId", newUser.id);
          await request.session.save();

          if (state.redirect) {
            return reply.redirect(state.redirect);
          }

          return reply.redirect("/");
        }

        return reply.redirect(`/new-zoom-connection`);
      }

      const identity = await zoomAuth.getUserIdentityByToken(auth.authToken);

      try {
        await this.member.addIdentity(userId, identity);

        await zoomAuth.storeUserAuth(
          {
            ...auth,
            expiresAt: new Date(auth.expiresAt),
            type: zoomAuth.getZoomType(),
          },
          userId
        );

        if (state.import) {
          return reply.redirect("/import");
        }

        if (state.redirect) {
          return reply.redirect(state.redirect);
        }

        return reply.redirect("/");
      } catch (err) {
        this.logger.error("Error signing up with zoom: ", err);
        return reply.redirect(`/zoom-account-claimed`);
      }
    };

  handleCreatePKCEChallenge = async (request: FastifyRequest) => {
    // Create a base64url string of 32 random bytes
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = codeVerifier;

    request.session.set("codeVerifier", codeVerifier);

    await request.session.save();

    return { codeChallenge };
  };
}
