import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawRequestDefaultExpression,
  RawServerBase,
} from "fastify";
import { inject, injectable } from "tsyringe";
import multipartPlugin from "@fastify/multipart";
import { VideoStorageService } from "@root/domains/interview/interactors/InteractorServices";
import { InterviewerInteractor } from "@root/domains/interview/interactors/InterviewerInteractor";
import _ from "lodash";
import fastifyRawBody from "fastify-raw-body";
import { EditorInteractor } from "../interactors/EditorInteractor";
import { Logger } from "@root/global/logger";
import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { CreatorInteractor } from "../interactors/CreatorInteractor";

export interface RouterVideoStorageService {
  getVideoSize(idWithExtension: string): Promise<number>;
}

interface UploadAssetCreatedEvent {
  type: "video.upload.asset_created";
  data: {
    asset_id: string;
    new_asset_settings: {
      passthrough: string;
    };
  };
}

interface AssetReadyEvent {
  type: "video.asset.ready";
  data: {
    id: string;
    passthrough?: string;
  };
}

interface StaticRenditionReadyEvent {
  type: "video.asset.static_renditions.ready";
  data: {
    id: string;
    passthrough?: string;
    static_renditions: {
      files: [
        {
          name: string;
        }
      ];
    };
  };
}

@injectable()
export class VideoRouter {
  constructor(
    @inject("VideoStorageService")
    private videoStorageService: VideoStorageService &
      RouterVideoStorageService,
    private interviewer: InterviewerInteractor,
    private editor: EditorInteractor,
    @inject("Logger") private logger: Logger,
    private creator: CreatorInteractor
  ) {}

  plugin = async (app: FastifyInstance) => {
    app.register(multipartPlugin);
    app.register(fastifyRawBody);
    app.get("/video/:idWithExtension", this.getVideo);
    app.post("/mux/webhooks", this.handleMuxWebhook);
    return;
  };

  getVideo = async (
    request: FastifyRequest<{
      Params: { idWithExtension: string };
      Headers: { range: string };
    }>,
    reply: FastifyReply<
      RawServerBase,
      RawRequestDefaultExpression<RawServerBase>
    >
  ) => {
    const idWithExtension = request.params.idWithExtension;
    const range = request.headers.range;
    if (!range || _.isNaN(Number(range.replace(/\D/g, "")))) {
      return reply.status(400);
    }

    const videoSize = await this.videoStorageService.getVideoSize(
      idWithExtension
    );

    const CHUNK_SIZE = 10 ** 6;

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    reply.header("Content-Range", `bytes ${start}-${end}/${videoSize}`);
    reply.header("Accept-Ranges", "bytes");
    reply.header("Content-Length", end - start + 1);
    reply.header("Content-Type", "video/mp4");

    reply.status(206);

    reply.send(
      await this.videoStorageService.getVideoStream(idWithExtension, start, end)
    );
  };
  handleMuxWebhook = async (
    request: FastifyRequest<{
      Body:
        | UploadAssetCreatedEvent
        | AssetReadyEvent
        | StaticRenditionReadyEvent;
    }>
  ) => {
    const { type, data } = request.body;
    this.logger.info("mux webhook received", { type });
    if (type === "video.asset.ready") {
      const { id: assetId } = data;
      try {
        await this.editor.handleAssetReady(assetId);
      } catch (error) {
        if (
          typeof error === "object" &&
          (error as any)?.name === "NotFoundError"
        ) {
          this.logger.warn("mux webhook received for unknown asset", {
            assetId,
          });

          return "ok";
        }
        throw error;
      }
    }
    if (type === "video.upload.asset_created") {
      const {
        asset_id: assetId,
        new_asset_settings: { passthrough: passthroughId },
      } = data;

      if (!passthroughId || !assetId) {
        this.logger.warn("mux webhook received for unknown asset", {
          assetId,
          passthroughId,
        });

        return "ok";
      }
      await this.creator.handleUploadComplete({
        assetId,
      });
    }
    if (type === "video.asset.static_renditions.ready") {
      const { id: assetId, passthrough: passthroughId } = data;
      if (!passthroughId || !assetId) {
        this.logger.warn("mux webhook received for unknown asset", {
          assetId,
          passthroughId,
        });
        return "ok";
      }
      await this.editor.handleDownloadableAssetReady(assetId, passthroughId);
    }
    return "ok";
  };
}
