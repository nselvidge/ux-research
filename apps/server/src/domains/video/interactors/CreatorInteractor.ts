import {
  VideoSourceService,
  VideoStorageService,
} from "@root/domains/interview/interactors/InteractorServices";
import { InterviewerInteractor } from "@root/domains/interview/interactors/InterviewerInteractor";
import { randomUUID } from "crypto";
import pino from "pino";
import { inject, injectable } from "tsyringe";
import {
  createVideo,
  isEditableAsset,
  isProcessingAsset,
  updateVideoEditableAsset,
} from "../entities/Video";
import { EditorInteractor } from "./EditorInteractor";
import {
  deserializeVideo,
  PersistenceVideo,
  SerializedEditableAsset,
} from "./serializers/SerializedVideo";

export type SourceRecording = {
  label: string;
  externalId: string;
  startTime: string;
};

export type SourceRecordingListPage = {
  totalCount: number;
  totalPages: number;
  nextPageToken?: string;
  recordings: SourceRecording[];
};

export interface VideoImportSource {
  getRecordingListPage(
    userId: string,
    pageToken?: string
  ): Promise<SourceRecordingListPage>;
}

export type VideoSourceFactory = (sourceLabel: string) => VideoSourceService;

export interface VideoEditingService {
  processVideo: (
    videoId: string,
    videoStorageService: VideoStorageService
  ) => Promise<SerializedEditableAsset>;
  getPreviewImageUrl: (
    playbackId: string,
    isSigned: boolean
  ) => Promise<string>;
}

export interface VideoUploadService {
  createUploadUrl: (
    passthroughId: string
  ) => Promise<{ url: string; id: string }>;
  getUploadStatus: (sourceId: string) => Promise<
    | { status: "error"; error: string }
    | { status: "pendingEditableAssetCreated" }
    | { status: "pendingEditableAssetReady"; assetId: string }
    | {
        status: "pendingDownloadableAssetReady";
        assetId: string;
        playbackId: string;
      }
    | { status: "ready"; assetId: string; passthroughId: string }
  >;
}

export interface CreatorVideoRepository {
  createVideo: (video: PersistenceVideo) => Promise<PersistenceVideo>;
  addEditableAsset: (video: PersistenceVideo) => Promise<PersistenceVideo>;
  getVideoByAssetId: (assetId: string) => Promise<PersistenceVideo>;
  maybeGetVideoByAssetId: (assetId: string) => Promise<PersistenceVideo | null>;
}

export interface CreatorRepositories {
  videos: CreatorVideoRepository;
}

export interface VideoPlaybackService {
  getPlayableUrlForVideo: (
    playbackId: string,
    isSigned: boolean
  ) => Promise<string>;
}

export type VideoPlaybackServiceFactory = (
  platform: string
) => VideoPlaybackService;

@injectable()
export class CreatorInteractor {
  constructor(
    @inject("VideoStorageService")
    private videoStorageService: VideoStorageService,
    @inject("VideoSourceFactory")
    private getVideoSource: VideoSourceFactory,
    @inject("VideoEditingService")
    private videoEditingService: VideoEditingService,
    @inject("Logger") private logger: pino.Logger,
    @inject("Repositories") private repositories: CreatorRepositories,
    @inject("VideoUploadService") private uploadService: VideoUploadService,
    private interviewer: InterviewerInteractor,
    private editor: EditorInteractor
  ) {}

  createUploadUrl = async (passthroughId: string) => {
    return this.uploadService.createUploadUrl(passthroughId);
  };

  handleUploadComplete = async ({ assetId }: { assetId: string }) => {
    // When the upload is complete, we still need to wait for the video to be
    // processed by the video editing service. We won't publish the uploadComplete
    // event until the video is ready to be played back since we don't want to
    // show the video in the UI until it's ready.
    const video = createVideo({
      id: randomUUID(),
      startTime: new Date(),
      editableAsset: {
        id: assetId,
        isSigned: true,
        status: "processing",
        playbackId: null,
      },
    });

    await this.repositories.videos.createVideo(video);
  };

  transferVideoFromSource = async (
    interviewId: string,
    sourceId: string,
    userId: string,
    sourceLabel: string
  ) => {
    if (!userId) {
      throw new Error("must be authenticated with video provider to import");
    }
    this.logger.info("storing video");
    // TODO: add support for recall
    const videoSourceService = this.getVideoSource(sourceLabel);

    const { recordingId, startTime } =
      await videoSourceService.pushVideoToDestination(
        sourceId,
        userId,
        this.videoStorageService
      );

    let video = createVideo({
      id: recordingId,
      startTime,
      playableAsset: {
        id: recordingId,
        platform: this.videoStorageService.platform,
        isSigned: false,
      },
    });

    video = await this.repositories.videos
      .createVideo(video)
      .then(deserializeVideo);

    const asset = await this.videoEditingService.processVideo(
      recordingId,
      this.videoStorageService
    );

    if (!isProcessingAsset(asset) && !isEditableAsset(asset)) {
      throw new Error("video editing service returned invalid asset");
    }

    const updatedVideo = updateVideoEditableAsset(video, asset);

    await this.repositories.videos.addEditableAsset(updatedVideo);

    // TODO: emit an event instead of directly updating the interview
    await this.interviewer.addRecordingToInterview(
      interviewId,
      startTime,
      recordingId
    );
  };

  videoIsReady = async (externalId: string, userId: string, source: string) => {
    const videoSourceService = this.getVideoSource(source);

    return videoSourceService.isVideoReady(externalId, userId);
  };

  getRecordingsForProvider = async (
    videoProvider: VideoImportSource,
    userId: string,
    pageToken?: string
  ) => {
    const result = await videoProvider.getRecordingListPage(userId, pageToken);

    return result;
  };

  checkRecordingStatus = async ({
    sourceId,
    userId,
    source,
    interviewId,
  }: {
    sourceId: string;
    userId: string;
    source: string;
    interviewId: string;
  }) => {
    const videoSourceService = this.getVideoSource(source);

    if (!(await videoSourceService.isVideoReady(sourceId, userId))) {
      this.logger.info("video is not ready yet", {
        sourceId,
        source,
      });
      return;
    }

    this.logger.info("video is ready, transferring", {
      interviewId,
      sourceId,
      source,
    });

    await this.transferVideoFromSource(interviewId, sourceId, userId, source);
  };

  checkUploadStatus = async ({ sourceId }: { sourceId: string }) => {
    const uploadStatus = await this.uploadService.getUploadStatus(sourceId);

    if (uploadStatus.status === "error") {
      // TODO: Add error state to interviews
      this.logger.error("upload failed", {
        sourceId,
        error: uploadStatus.error,
      });
      return;
    }

    if (uploadStatus.status === "pendingEditableAssetCreated") {
      this.logger.info("upload is pending editable asset creation", {
        sourceId,
      });
      return;
    }

    // Ensure there is a video for this assetId. If there isn't, then we
    // need to create one.
    let maybeVideo = await this.repositories.videos.maybeGetVideoByAssetId(
      uploadStatus.assetId
    );

    if (!maybeVideo) {
      await this.handleUploadComplete({
        assetId: uploadStatus.assetId,
      });
      maybeVideo = await this.repositories.videos.getVideoByAssetId(
        uploadStatus.assetId
      );
    }

    const video = deserializeVideo(maybeVideo);

    if (
      (uploadStatus.status === "pendingDownloadableAssetReady" ||
        uploadStatus.status === "ready") &&
      !isEditableAsset(video.editableAsset)
    ) {
      // Video was not updated with an editable asset, so we need to
      // trigger the asset ready flow
      await this.editor.handleAssetReady(uploadStatus.assetId);
      return;
    }

    if (uploadStatus.status === "ready") {
      // If the upload is ready, then we need to trigger the uploadComplete
      // event so that the video is processed and the interview is updated.
      await this.editor.handleDownloadableAssetReady(
        uploadStatus.assetId,
        uploadStatus.passthroughId
      );
      return;
    }
  };
}
