import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import _ from "lodash";
import { InferType, number, object, string } from "yup";
import crypto from "crypto";
import { Settings } from "@root/global/Settings";
import fastifyRawBody from "fastify-raw-body";
import { Logger } from "@root/global/logger";
import { CoordinatorInteractor } from "../interactors/CoordinatorInteractor";
import { ZoomService } from "@root/domains/video/services/ZoomService";
import { VideoSources } from "@root/domains/video/services/VideoSources";
import {
  ZoomCredentialManager,
  ZoomVersions,
} from "@root/global/ZoomCredentialManager";

export interface RouterVideoStorageService {
  getVideoSize(idWithExtension: string): Promise<number>;
}

const webhookValidator = object({
  event: string().required(),
  event_ts: number().required(),
  payload: object({
    object: object({
      uuid: string().required(),
    }),
  }).required(),
});

type WebhookBody = InferType<typeof webhookValidator>;

const isWebhookBody = (body: any): body is WebhookBody =>
  webhookValidator.isType(body);

const jwtPayloadValidator = object({
  userId: string().required(),
  meetingId: string().required(),
}).required();

interface VideoReadyWebhook {
  event: "event.video_ready";
  payload: {
    object: {
      uuid: string;
      topic: string;
      start_time: string;
    };
  };
}
interface UrlValidationWebhook {
  payload: {
    plainToken: string;
  };
  event_ts: number;
  event: "endpoint.url_validation";
}

@injectable()
export class ZoomInterviewRouter {
  constructor(
    private coordinator: CoordinatorInteractor,
    private settings: Settings,
    @inject("Logger") private logger: Logger,
    private zoomCredentials: ZoomCredentialManager,
    @inject("ZoomServiceV2") private zoomService: ZoomService
  ) {}

  plugin = async (app: FastifyInstance) => {
    app.register(fastifyRawBody);
    app.post("/zoom/video-ready", this.makeHandleVideoReady(""));

    app.post("/zoom/v2/video-ready", this.makeHandleVideoReady("V2"));

    app.get("/recall-join-token", this.handleLocalRecordingToken);
    return;
  };

  makeHandleVideoReady =
    (version: ZoomVersions) =>
    async (
      request: FastifyRequest<{
        Body: VideoReadyWebhook | UrlValidationWebhook;
      }>,
      reply: FastifyReply
    ) => {
      this.logger.info("Received webhook from Zoom");
      this.zoomCredentials.setVersion(version);
      const credentials = this.zoomCredentials.getCredentials();

      const data = request.body;
      const signature = request.headers["x-zm-signature"];
      const timestamp = request.headers["x-zm-request-timestamp"];

      const messageString = `v0:${timestamp}:${request.rawBody}`;

      const secret = credentials.verificationSecret;

      if (!secret) {
        throw new Error("zoom verification secret not set");
      }

      // Webhook request event type is a challenge-response check
      if (request.body.event === "endpoint.url_validation") {
        this.logger.info("Received url validation webhook from Zoom");
        const hashForValidate = crypto
          .createHmac("sha256", secret)
          .update(request.body.payload.plainToken)
          .digest("hex");

        reply.status(200);
        return {
          plainToken: request.body.payload.plainToken,
          encryptedToken: hashForValidate,
        };
      }

      if (!isWebhookBody(data) || !signature) {
        this.logger.error("Invalid webhook received from Zoom");
        throw new Error("invalid webhook format");
      }

      this.logger.info("Handling video ready webhook from Zoom", {
        uuid: data.payload.object.uuid,
      });

      const hashedMessage = crypto
        .createHmac("sha256", secret)
        .update(messageString)
        .digest("hex");

      if (signature !== `v0=${hashedMessage}`) {
        this.logger.error("Invalid webhook received from Zoom");
        throw new Error("webhook signature is invalid");
      }

      this.logger.info("Zoom webhook signature is valid");

      try {
        await this.coordinator.handleInterviewReady(
          data.payload.object.uuid,
          `zoom${version}`
        );
      } catch (err) {
        // no point surfacing the error to zoom since they do nothing with it
        this.logger.error(
          "there was a problem handling the ready interview",
          err
        );
      }

      this.logger.info("Successfully handled video ready webhook from Zoom");

      return "success";
    };

  handleLocalRecordingToken = async (
    request: FastifyRequest<{ Querystring: { token: string } }>,
    reply: FastifyReply
  ) => {
    this.logger.info("Received request for local recording token from recall");
    const token = request.query.token;
    if (!token) {
      this.logger.error("no token provided", {
        query: request.query,
      });
      return;
    }

    const secret = this.settings.getSetting("jwtSecret");

    if (!secret) {
      this.logger.error("jwt secret not set");
      return;
    }

    const decodedToken = jwt.verify(token, secret);

    if (!jwtPayloadValidator.isValidSync(decodedToken)) {
      this.logger.error("Invalid jwt token received from recall");
      return;
    }

    const zoomLocalRecordingToken = await this.zoomService.getMeetingJoinToken(
      decodedToken
    );

    reply.status(200);
    return zoomLocalRecordingToken;
  };
}
