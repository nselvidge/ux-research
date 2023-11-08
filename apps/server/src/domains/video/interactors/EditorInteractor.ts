import { inject, injectable } from "tsyringe";
import {
  createVideoClip,
  isEditableAsset,
  isProcessingAsset,
  updateVideoEditableAsset,
  updateVideoPlayableAsset,
} from "../entities/Video";
import {
  deserializeVideo,
  PersistenceVideo,
  SerializedEditableAsset,
  serializeVideo,
} from "./serializers/SerializedVideo";

export interface EditorVideoRepository {
  createVideo: (video: PersistenceVideo) => Promise<PersistenceVideo>;
  getVideoById: (id: string) => Promise<PersistenceVideo>;
  getVideoByAssetId: (assetId: string) => Promise<PersistenceVideo>;
  addEditableAsset: (video: PersistenceVideo) => Promise<PersistenceVideo>;
  updateEditableAsset: (video: PersistenceVideo) => Promise<PersistenceVideo>;
  addPlayableAsset: (video: PersistenceVideo) => Promise<PersistenceVideo>;
}

export interface EditorRepositories {
  videos: EditorVideoRepository;
}

type Milliseconds = number;

export interface EditorVideoEditingService {
  platform: "mux";
  getPlaybackIdForAsset: (
    assetId: string
  ) => Promise<{ playbackId: string; isSigned: boolean }>;
  createClip: (
    videoId: string,
    startTime: Milliseconds,
    endTime: Milliseconds
  ) => Promise<SerializedEditableAsset>;
}

export interface EditorPubSub {
  publishEditableAssetReady: (videoId: string) => Promise<void>;
  publishUploadComplete: ({
    passthroughId,
    videoId,
  }: {
    passthroughId: string;
    videoId: string;
  }) => Promise<void>;
}

@injectable()
export class EditorInteractor {
  constructor(
    @inject("Repositories")
    private repositories: EditorRepositories,
    @inject("VideoEditingService")
    private videoEditingService: EditorVideoEditingService,
    @inject("VideoPubSub") private publisher: EditorPubSub
  ) {}

  handleAssetReady = async (assetId: string) => {
    const video = await this.repositories.videos
      .getVideoByAssetId(assetId)
      .then(deserializeVideo);

    const { playbackId, isSigned } =
      await this.videoEditingService.getPlaybackIdForAsset(assetId);

    const videoWithEditableAsset = updateVideoEditableAsset(video, {
      status: "completed",
      id: assetId,
      playbackId,
      isSigned,
    });

    await this.repositories.videos.updateEditableAsset(videoWithEditableAsset);

    await this.publisher.publishEditableAssetReady(video.id);

    if (videoWithEditableAsset.playableAsset) {
      return serializeVideo(videoWithEditableAsset);
    }

    const playableAssset = {
      id: playbackId,
      platform: this.videoEditingService.platform,
      isSigned,
    };

    const videoWithPlayableAsset = updateVideoPlayableAsset(
      videoWithEditableAsset,
      playableAssset
    );

    await this.repositories.videos.addPlayableAsset(videoWithPlayableAsset);

    return serializeVideo(videoWithPlayableAsset);
  };

  handleDownloadableAssetReady = async (
    assetId: string,
    passthroughId: string
  ) => {
    const video = await this.repositories.videos
      .getVideoByAssetId(assetId)
      .then(deserializeVideo);

    await this.publisher.publishUploadComplete({
      passthroughId,
      videoId: video.id,
    });
  };

  createClip = async (videoId: string, startTime: number, endTime: number) => {
    const video = await this.repositories.videos
      .getVideoById(videoId)
      .then(deserializeVideo);

    const { clip, editableAssetId } = createVideoClip(
      video,
      startTime,
      endTime
    );

    await this.repositories.videos.createVideo(clip);

    const editableAsset = await this.videoEditingService.createClip(
      editableAssetId,
      startTime,
      endTime
    );

    if (!isProcessingAsset(editableAsset) && !isEditableAsset(editableAsset)) {
      throw new Error("Invalid editable asset");
    }

    const updatedClip = updateVideoEditableAsset(clip, editableAsset);

    await this.repositories.videos.addEditableAsset(updatedClip);

    return serializeVideo(updatedClip);
  };
}
