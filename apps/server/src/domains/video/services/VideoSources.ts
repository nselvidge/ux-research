import { VideoSourceService } from "@root/domains/interview/interactors/InteractorServices";
import { isImportSources } from "@root/domains/interview/interactors/InterviewerInteractor";
import { inject, injectable } from "tsyringe";
import { VideoSourceFactory } from "../interactors/CreatorInteractor";
import { RecallService } from "./RecallService";
import { ZoomService } from "./ZoomService";

@injectable()
export class VideoSources {
  private sourceMap: {
    [label in "zoom" | "zoomV2" | "recall"]: VideoSourceService;
  };

  constructor(@inject("ZoomServiceV1") zoomV1: ZoomService, @inject("ZoomServiceV2") zoomV2: ZoomService, recall: RecallService) {
    this.sourceMap = {
      ["zoom"]: zoomV1,
      ["zoomV2"]: zoomV2, 
      ["recall"]: recall,
    };
  }

  get: VideoSourceFactory = (label: string): VideoSourceService => {
    if (!isImportSources(label)) {
      throw new Error(
        `Invalid video source label ${label} provided. Expected one of zoom, upload`
      );
    }

    return this.sourceMap[label];
  };
}
