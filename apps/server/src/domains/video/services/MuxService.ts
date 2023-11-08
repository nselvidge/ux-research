import { inject, injectable } from "tsyringe";
import {
  VideoEditingService,
  VideoPlaybackService,
  VideoUploadService,
} from "../interactors/CreatorInteractor";
import Mux from "@mux/mux-node";
import { Settings } from "@root/global/Settings";
import { EditorVideoEditingService } from "../interactors/EditorInteractor";
import { ViewerVideoPlaybackService } from "../interactors/ViewerInteractor";
import { Logger } from "@root/global/logger";

export interface VideoStorageService {
  getUrlForVideo: (videoId: string, isSigned: boolean) => Promise<string>;
}

type Milliseconds = number;

@injectable()
export class MuxService
  implements
    VideoEditingService,
    EditorVideoEditingService,
    VideoPlaybackService,
    VideoUploadService,
    ViewerVideoPlaybackService
{
  public readonly platform = "mux";
  constructor(
    private settings: Settings,
    @inject("Logger") private logger: Logger
  ) {}

  getPlayableUrlForVideo = async (playbackId: string, isSigned: boolean) =>
    isSigned
      ? `https://stream.mux.com/${playbackId}.m3u8?token=${Mux.JWT.signPlaybackId(
          playbackId
        )}`
      : `https://stream.mux.com/${playbackId}.m3u8`;

  getPreviewImageUrl = async (playbackId: string, isSigned: boolean) =>
    isSigned
      ? `https://image.mux.com/${playbackId}/thumbnail.png?token=${Mux.JWT.signPlaybackId(
          playbackId,
          {
            type: "thumbnail",
            params: { width: "320", height: "180", fit_mode: "crop" },
          }
        )}`
      : `https://image.mux.com/${playbackId}/thumbnail.png`;

  getPreviewGifUrl = async (playbackId: string, isSigned?: boolean) =>
    isSigned
      ? `https://image.mux.com/${playbackId}/animated.gif?token=${Mux.JWT.signPlaybackId(
          playbackId,
          {
            type: "gif",
            params: { start: "5" },
          }
        )}`
      : `https://image.mux.com/${playbackId}/animated.gif`;

  getDownloadUrlForVideo = async (playbackId: string, isSigned: boolean) =>
    isSigned
      ? `https://stream.mux.com/${playbackId}/low.mp4?token=${Mux.JWT.signPlaybackId(
          playbackId
        )}`
      : `https://stream.mux.com/${playbackId}/low.mp4`;

  processVideo = async (
    videoId: string,
    videoStorageService: VideoStorageService
  ) => {
    const url = await videoStorageService.getUrlForVideo(videoId, true);

    const { Video } = new Mux(
      this.settings.getSetting("muxTokenId"),
      this.settings.getSetting("muxTokenSecret")
    );

    const asset = await Video.Assets.create({
      input: url,
      playback_policy: "signed",
    });

    if (asset.status === "errored") {
      throw new Error("error processing video");
    }

    if (asset.status === "ready") {
      const signedPlayback = asset.playback_ids?.find(
        (id) => id.policy === "signed"
      );
      if (!signedPlayback) {
        throw new Error("no playback id");
      }

      return {
        id: asset.id,
        status: "completed" as const,
        playbackId: signedPlayback.id,
        isSigned: true,
      };
    }

    return {
      id: asset.id,
      status: "processing" as const,
      playbackId: null,
      isSigned: true,
    };
  };
  getPlaybackIdForAsset = async (assetId: string) => {
    const { Video } = new Mux(
      this.settings.getSetting("muxTokenId"),
      this.settings.getSetting("muxTokenSecret")
    );

    const asset = await Video.Assets.get(assetId);

    // TODO: remove support for unsigned playback IDs when migration completed
    const signedPlayback = asset.playback_ids?.find(
      (id) => id.policy === "signed"
    );
    const unsignedPlayback = asset.playback_ids?.find(
      (id) => id.policy === "public"
    );

    if (signedPlayback) {
      return { playbackId: signedPlayback.id, isSigned: true };
    } else if (unsignedPlayback) {
      return { playbackId: unsignedPlayback.id, isSigned: true };
    }

    throw new Error(`no playback id for asset ${assetId}`);
  };

  createClip = async (
    assetId: string,
    startTime: Milliseconds,
    endTime: Milliseconds
  ) => {
    const { Video } = new Mux(
      this.settings.getSetting("muxTokenId"),
      this.settings.getSetting("muxTokenSecret")
    );

    const asset = await Video.Assets.create({
      input: [
        {
          url: `mux://assets/${assetId}`,
          start_time: startTime / 1000,
          end_time: endTime / 1000,
        },
      ],
      playback_policy: ["signed"],
    });

    if (asset.status === "errored") {
      throw new Error("error processing video");
    }

    if (asset.status === "ready") {
      const signedPlayback = asset.playback_ids?.find(
        (id) => id.policy === "signed"
      );
      if (!signedPlayback) {
        throw new Error("no playback id");
      }

      return {
        id: asset.id,
        status: "completed" as const,
        playbackId: signedPlayback.id,
        isSigned: true,
      };
    }

    return {
      id: asset.id,
      status: "processing" as const,
      playbackId: null,
      isSigned: true,
    };
  };

  createUploadUrl = async (passthroughId: string) => {
    const { Video } = new Mux(
      this.settings.getSetting("muxTokenId"),
      this.settings.getSetting("muxTokenSecret")
    );
    const cors_origin = this.settings.getSetting("serverHost");
    const upload = await Video.Uploads.create({
      cors_origin,
      new_asset_settings: {
        passthrough: passthroughId,
        playback_policy: ["signed"],
        mp4_support: "standard",
      },
    });

    return { url: upload.url, id: upload.id };
  };

  getUploadStatus = async (uploadId: string) => {
    const { Video } = new Mux(
      this.settings.getSetting("muxTokenId"),
      this.settings.getSetting("muxTokenSecret")
    );
    const upload = await Video.Uploads.get(uploadId);

    if (
      upload.status === "errored" ||
      upload.status === "cancelled" ||
      upload.status === "timed_out"
    ) {
      this.logger.error(
        `error processing video upload ${uploadId}: ${upload.status}`,
        upload.error
      );
      return {
        status: "error",
        error: `error processing video upload ${uploadId}: ${upload.status}`,
      } as const;
    }

    if (upload.status === "waiting") {
      return {
        status: "pendingEditableAssetCreated",
      } as const;
    }

    if (upload.status === "asset_created") {
      const assetId = upload.asset_id;
      if (!assetId) {
        throw new Error("no asset id but asset created");
      }

      const asset = await Video.Assets.get(assetId);

      const signedPlayback = asset.playback_ids?.find(
        (id) => id.policy === "signed"
      );

      if (!signedPlayback) {
        return {
          status: "pendingEditableAssetReady",
          assetId,
        } as const;
      }

      if (!asset.passthrough) {
        throw new Error("no passthrough id");
      }

      return {
        status: "ready",
        assetId,
        passthroughId: asset.passthrough,
      } as const;
    }

    this.logger.error("unknown upload status", upload);

    throw new Error("unknown upload status");
  };
}
