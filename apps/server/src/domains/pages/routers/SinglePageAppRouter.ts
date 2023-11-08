import { Settings } from "@root/global/Settings";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteHandlerMethod,
} from "fastify";
import { inject, injectable } from "tsyringe";
import viewPlugin from "point-of-view";
import handlebars from "handlebars";
import path from "node:path";
import proxy from "@fastify/http-proxy";
import {
  ZoomAuth,
  ZoomAuthFactory,
} from "@root/domains/auth/services/ZoomAuth";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { Logger } from "@root/global/logger";

export interface AssetService {
  getAssetList(): string[];
}

@injectable()
export class SinglePageAppRouter {
  constructor(
    private settings: Settings,
    private zoomAuthFactory: ZoomAuthFactory,
    private member: MemberInteractor,
    @inject("Logger") private logger: Logger
  ) {}
  plugin = async (app: FastifyInstance) => {
    app.register(viewPlugin, {
      engine: { handlebars },
      root: path.join(__dirname, "../assets"),
    });
    app.setNotFoundHandler(this.handleNotFound);
    if (this.settings.getSetting("shouldProxyAssets")) {
      app.register(proxy, {
        upstream: this.settings.getSetting("assetUrl"),
        prefix: "/static",
      });
    }

    app.get("/privacy-policy", this.handleStaticPage("privacy-policy.hbs"));
    app.get("/terms-of-use", this.handleStaticPage("terms-of-use.hbs"));
    app.get("/support", this.handleStaticPage("support.hbs"));
    app.get("/documentation", this.handleStaticPage("documentation.hbs"));
    app.get(
      "/zoomverify/verifyzoom.html",
      this.handleStaticPage("verifyzoom.hbs")
    );

    app.route({
      url: "/zoom-client",
      method: "GET",
      handler: this.makeHandleZoomClient(""),
      preHandler: async (request, reply) => {
        reply.headers({
          "Strict-Transport-Security": "max-age=31536000 ; includeSubDomains",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy":
            "default-src 'self' *.typekit.net https://emergence-dev-spa.s3.us-west-1.amazonaws.com https://resonate-staging-assets.s3.amazonaws.com https://edge.fullstory.com/s/fs.js https://o4504181711765504.ingest.sentry.io;  style-src 'self' 'unsafe-inline'  *.typekit.net https://emergence-dev-spa.s3.us-west-1.amazonaws.com https://resonate-staging-assets.s3.amazonaws.com",
          "Referrer-Policy": "origin-when-cross-origin",
        });
      },
    });
    app.route({
      url: "/v2/zoom-client",
      method: "GET",
      handler: this.makeHandleZoomClient("V2"),
      preHandler: async (request, reply) => {
        reply.headers({
          "Strict-Transport-Security": "max-age=31536000 ; includeSubDomains",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy":
            "default-src 'self' *.typekit.net https://emergence-dev-spa.s3.us-west-1.amazonaws.com https://resonate-staging-assets.s3.amazonaws.com https://edge.fullstory.com/s/fs.js https://o4504181711765504.ingest.sentry.io;  style-src 'self' 'unsafe-inline'  *.typekit.net https://emergence-dev-spa.s3.us-west-1.amazonaws.com https://resonate-staging-assets.s3.amazonaws.com",
          "Referrer-Policy": "origin-when-cross-origin",
        });
      },
    });
    return;
  };

  makeHandleZoomClient =
    (version: "" | "V2") =>
    async (
      request: FastifyRequest<{ Headers: { "x-zoom-app-context": string } }>,
      reply: FastifyReply
    ) => {
      const zoomAuth = this.zoomAuthFactory.getZoomAuth(version);
      const encryptedContext = request.headers["x-zoom-app-context"];

      const context = await zoomAuth.decryptZoomAppContext(encryptedContext);

      const user = await this.member.maybeFindUserByIdentity({
        token: context.uid,
        type: "zoom",
      });

      if (!user) {
        this.logger.error("No user found for Zoom account", {
          context,
        });
        reply.status(400);
        return "No user found for this Zoom Account ID. Please contact Resonate support at help@resonateapp.com";
      }

      request.session.set("userId", user.id);
      await request.session.save();

      return reply.view("index.hbs", {
        assetUrl: this.settings.getSetting("shouldProxyAssets")
          ? "/static"
          : this.settings.getSetting("assetUrl"),
      });
    };

  handleStaticPage =
    (page: string) => async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.view(page, {});
    };

  handleNotFound: RouteHandlerMethod = async (request, reply) => {
    return reply.view("index.hbs", {
      assetUrl: this.settings.getSetting("shouldProxyAssets")
        ? "/static"
        : this.settings.getSetting("assetUrl"),
    });
  };
}
