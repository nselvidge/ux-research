import { inject, injectable } from "tsyringe";
import { PersistenceVideo } from "./serializers/SerializedVideo";

export interface ViewerVideoRepository {
  getVideoById: (id: string) => Promise<PersistenceVideo>;
  getVideosByIds: (ids: string[]) => Promise<PersistenceVideo[]>;
}

export interface VideoEditingService {
  getPreviewImageUrl: (
    playbackId: string,
    isSigned: boolean
  ) => Promise<string>;
  getPreviewGifUrl: (playbackId: string, isSigned: boolean) => Promise<string>;
}

export interface ViewerVideoPlaybackService {
  getDownloadUrlForVideo: (
    playbackId: string,
    isSigned: boolean
  ) => Promise<string>;
}

export type VideoPlaybackServiceFactory = (
  platform: string
) => ViewerVideoPlaybackService;

export interface ViewerRepositories {
  videos: ViewerVideoRepository;
}

@injectable()
export class ViewerInteractor {
  constructor(
    @inject("Repositories") private repositories: ViewerRepositories,
    @inject("VideoEditingService")
    private videoEditingService: VideoEditingService,
    @inject("VideoPlaybackServiceFactory")
    private createVideoPlaybackService: VideoPlaybackServiceFactory
  ) {}

  getVideoById = async (id: string) =>
    this.repositories.videos.getVideoById(id);

  getVideosByIds = async (ids: string[]) =>
    this.repositories.videos.getVideosByIds(ids);

  getPreviewImageUrlForVideo = async (id: string) => {
    const video = await this.getVideoById(id);
    if (!video.editableAsset?.playbackId) {
      return null;
    }

    return this.getPreviewImageUrl(
      video.editableAsset.playbackId,
      video.editableAsset.isSigned
    );
  };

  getPreviewImageUrl = async (playbackId: string, isSigned: boolean) =>
    this.videoEditingService.getPreviewImageUrl(playbackId, isSigned);

  getPreviewGifUrl = async (playbackId: string, isSigned: boolean) =>
    this.videoEditingService.getPreviewGifUrl(playbackId, isSigned);

  getDownloadUrl = async (videoId: string) => {
    const video = await this.getVideoById(videoId);
    if (!video.playableAsset) {
      throw new Error("Video is not ready to download");
    }

    const playbackService = this.createVideoPlaybackService(
      video.playableAsset.platform
    );

    return playbackService.getDownloadUrlForVideo(
      video.playableAsset.id,
      video.playableAsset.isSigned
    );
  };
}
