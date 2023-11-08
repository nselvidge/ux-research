import { inject, injectable } from "tsyringe";
import { ZoomService } from "./ZoomService";

@injectable()
export class RecordableProviderFactory {
  constructor(private zoom: ZoomService) {}
  createRecordableProvider = (platform: "zoom") => {
    if (platform === "zoom") {
      return this.zoom;
    }
    throw new Error("Unsupported platform");
  };
}
