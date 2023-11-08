import { injectable } from "tsyringe";
import { VideoPlaybackServiceFactory } from "../interactors/CreatorInteractor";
import { VideoPlaybackServiceFactory as ViewerFactory } from "../interactors/ViewerInteractor";
import { MuxService } from "./MuxService";
import { S3Service } from "./S3Service";

@injectable()
export class VideoPlaybackServices {
  constructor(
    private readonly s3Service: S3Service,
    private readonly muxService: MuxService
  ) {}

  getPlaybackService: VideoPlaybackServiceFactory & ViewerFactory = (
    platform: string
  ) => {
    switch (platform) {
      case "s3":
        return this.s3Service;
      case "mux":
        return this.muxService;
      default:
        throw new Error(
          `Invalid video storage platform ${platform} provided. Expected one of s3, mux`
        );
    }
  };
}
