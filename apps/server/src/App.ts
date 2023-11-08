import { ApolloServer } from "apollo-server-fastify";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { inject, injectable } from "tsyringe";
import { Resolvers } from "@root/global/Resolvers";
import { typeDefs } from "@root/global/typedefs";
import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { Router } from "@root/global/Router";
import fastifySession from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import { SessionRepository } from "./domains/auth/repositories/SessionRepository";
import { Settings } from "./global/Settings";
import { Repositories } from "./global/Repositories";
import httpsAlways from "fastify-https-always";
import { Logger } from "./global/logger";
import * as Sentry from "@sentry/node";
import { MemoryPubSub } from "./domains/auth/services/MemoryPubSub";

import { ResearcherInteractor } from "./domains/interview/interactors/ResearcherInteractor";
import { InterviewPubSub } from "./domains/interview/services/InterviewPubSub";
import { UploaderInteractor } from "./domains/interview/interactors/UploaderInteractor";

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

@injectable()
export class App {
  constructor(
    private resolvers: Resolvers,
    private router: Router,
    private sessionStore: SessionRepository,
    private repositories: Repositories,
    private settings: Settings,
    @inject("Logger") private logger: Logger,
    @inject("Sentry") private sentry: typeof Sentry,
    @inject("WorkspacePubSub") private workspacePubSub: MemoryPubSub,
    private researcher: ResearcherInteractor,
    private interviewPubSub: InterviewPubSub,
    private uploader: UploaderInteractor
  ) {}
  async createServer() {
    // subscriptions handled within the web process
    this.workspacePubSub.subscribeToNewWorkspace(
      this.researcher.handleNewWorkspace
    );

    this.interviewPubSub.subscribeToVideoUploaded(
      this.uploader.handleUploadComplete
    );

    const app = fastify({
      logger: false,
      trustProxy: true,
    });

    app.addHook("onResponse", async (request, response) => {
      let userId;
      try {
        userId = await request.session.get("userId");
      } catch (err) {
        this.logger.error("Error getting userId from session", err);
      }

      if (response.statusCode >= 400) {
        return this.logger.error({
          message: "Request handled",
          url: request.url,
          status: response.statusCode,
          userId,
        });
      }

      this.logger.info({
        message: "Request handled",
        url: request.url,
        status: response.statusCode,
        userId,
      });
    });

    app.addHook("onError", async (request, response, error) => {
      let userId;
      try {
        userId = await request.session.get("userId");
      } catch (err) {
        this.logger.error("Error getting userId from session", err);
      }
      this.sentry.captureException(error);
      this.logger.error("Request errored", {
        url: request.url,
        status: response.statusCode,
        userId,
        error,
      });
      return;
    });

    app.register(httpsAlways, {
      enabled: this.settings.getSetting("protocol") === "https",
      redirect: true,
    });

    app.register(fastifyCookie);
    app.register(fastifySession, {
      secret: "a blue cow jumped over the moon 32 times in one day",
      store: this.sessionStore,
      cookie: { secure: false, maxAge: 100 * 60 * 60 * 24 * 90 },
    });

    app.addHook("preHandler", async (request, reply) => {
      if (request.session.get("userId")) {
        const user = await this.repositories.users.maybeGetUserById(
          request.session.get("userId")
        );

        if (!user) {
          request.session.set("userId", undefined);
          await request.session.save();
          reply.redirect(302, "/login?flashCode=invalidSession");
        }

        return;
      }
      return;
    });

    app.register(this.router.plugin);

    const logging: ApolloServerPlugin = {
      requestDidStart: async (requestContext) => {
        this.logger.info("GraphQL request started", {
          operationName: requestContext.request.operationName,
          userId: requestContext.context.userId,
        });

        return {
          willSendResponse: async (requestContext) => {
            this.logger.info("GraphQL request finished", {
              operationName: requestContext.request.operationName,
              userId: requestContext.context.userId,
            });
          },
        };
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers: this.resolvers.getMergedResolvers(),
      csrfPrevention: true,
      formatError: (err) => {
        this.logger.error("Apollo Error:", err);
        this.sentry.captureException(err);
        return err;
      },
      plugins: [
        logging,
        fastifyAppClosePlugin(app),
        ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
      ],
      context: ({ request }) => {
        return {
          isSystemComponent:
            request.headers.AuthToken ===
            this.settings.getSetting("internalApiToken"),
          userId: request.session.get("userId"),
          loaders: this.resolvers.createLoaders(),
        };
      },
    });

    await server.start();

    app.register(
      server.createHandler({
        cors: {
          origin: this.settings.getSetting("assetUrl"),
          credentials: true,
        },
      })
    );

    app.register(cors, {
      origin: this.settings.getSetting("assetUrl"),
    });

    return app;
  }
}
