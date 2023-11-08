import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { object, string } from "yup";
import formbody from "@fastify/formbody";
import { AdminInteractor } from "../interactors/Admin";
import { isNotFound, LocalAuth } from "../services/LocalAuth";
import { Repositories } from "@root/global/Repositories";
import pino from "pino";

const localAuthValidator = object({
  email: string().email().required(),
  fullName: string().required(),
  password: string().min(12).required(),
});

const loginValidator = object({
  email: string().email().required(),
  password: string().min(12).required(),
});

@injectable()
export class AuthRouter {
  constructor(
    private admin: AdminInteractor,
    private localAuth: LocalAuth,
    private repositories: Repositories,
    @inject("Logger") private logger: pino.Logger
  ) {}
  plugin = async (app: FastifyInstance) => {
    app.register(formbody);
    app.post("/signup", this.signup);
    app.post("/login", this.login);
    app.get("/logout", this.logout);
    app.get("/invite/:token", this.invite);
  };
  invite = async (
    request: FastifyRequest<{ Params: { token: string } }>,
    reply: FastifyReply
  ) => {
    const inviteToken = request.params.token;
    try {
      this.logger.info("Handling Invite: ", inviteToken);
      const workspaceName = await this.admin.getWorkspaceNameForToken(
        inviteToken
      );

      request.session.set("inviteToken", inviteToken);
      await request.session.save();

      reply.redirect(`/signup?workspace=${encodeURIComponent(workspaceName)}`);
    } catch (err) {
      this.logger.error("Error Handling Invite: ", err);
      reply.redirect("/signup?error=invalidInviteToken");
    }
  };
  signup = async (
    request: FastifyRequest<{
      Body: {
        fullName: string;
        email: string;
        password: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Signup is disabled in production.");
    }
    const data = request.body;

    await localAuthValidator.validate(data);

    const identity = await this.localAuth.createAuthentication(data);
    const inviteToken = request.session.get<string | undefined>("inviteToken");

    const user = await this.admin.signup(identity, inviteToken, false);

    request.session.set("userId", user.id);
    await request.session.save();

    return reply.redirect(302, "/");
  };
  login = async (
    request: FastifyRequest<{
      Body: {
        email: string;
        password: string;
      };
      Querystring: {
        redirect?: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    const data = request.body;
    await loginValidator.validate(data);
    try {
      const user = await this.localAuth.authenticate(data);

      request.session.set("userId", user.id);
      let redirect = request.query.redirect || "/";

      if (redirect && redirect.startsWith("/")) {
        redirect = decodeURIComponent(redirect);
      } else if (redirect) {
        redirect = "/" + decodeURIComponent(redirect);
      }

      reply.redirect(302, redirect);
    } catch (error) {
      if (isNotFound(error)) {
        return reply.redirect(
          302,
          `/login?error=NotFound&email=${encodeURIComponent(data.email)}`
        );
      }

      throw error;
    }
  };
  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    await request.session.destroy();
    reply.clearCookie("sessionId", { path: "/" });
    reply.redirect(302, "/login?flashCode=loggedOutSuccess");
  };
}
