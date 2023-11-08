import { randomUUID } from "node:crypto";
import {
  exists,
  mkdir,
  createWriteStream,
  createReadStream,
  stat,
} from "node:fs";
import path from "node:path";
import { pipeline, Readable } from "node:stream";
import { promisify } from "node:util";
import { injectable } from "tsyringe";
import {
  VideoSourceService,
  VideoStorageService,
} from "@root/domains/interview/interactors/InteractorServices";
import { RouterVideoStorageService } from "@root/domains/video/routes/VideoRouter";
import { readFile } from "node:fs/promises";
import { Settings } from "@root/global/Settings";

const existsAsync = promisify(exists);
const mkDirAsync = promisify(mkdir);
const pipelineAsync = promisify(pipeline);
const statAsync = promisify(stat);

@injectable()
export class LocalFileService
  implements VideoSourceService, VideoStorageService, RouterVideoStorageService
{
  public readonly hasPublicUrl = false;
  public readonly requiresAuth = false;
  public readonly platform = "local";

  constructor(private settings: Settings) {}

  async ensureFolder() {
    if (
      !(await existsAsync(this.settings.getSetting("localFileStorageFolder")))
    ) {
      await mkDirAsync(this.settings.getSetting("localFileStorageFolder"));
    }
    if (
      !(await existsAsync(
        path.join(
          this.settings.getSetting("localFileStorageFolder"),
          this.settings.getSetting("videoFolder")
        )
      ))
    ) {
      await mkDirAsync(
        path.join(
          this.settings.getSetting("localFileStorageFolder"),
          this.settings.getSetting("videoFolder")
        )
      );
    }
  }

  getVideoName: (userId: string, externalId: string) => Promise<string> =
    async () => "Untitled Interview";

  getVideoDate = async () => new Date();

  getPendingVideoName: (userId: string, externalId: string) => Promise<string> =
    async () => "Untitled Interview";

  getPendingVideoDate = async () => new Date();

  getSpeakerData: (externalId: string) => Promise<null> = async () => null;

  async getUrlForVideo(id: string) {
    return `${this.settings.getSetting(
      "redirectUrl"
    )}/${this.settings.getSetting("videoFolder")}/${id}.mp4`;
  }

  checkFileName(fileName: string) {
    if (/[^A-Za-z0-9-]/.test(fileName)) {
      throw new Error("invalid file name");
    }
  }

  getPathForId(id: string) {
    return path.join(
      this.settings.getSetting("localFileStorageFolder"),
      `${id}.mp4`
    );
  }

  getPathForFileName(fileName: string) {
    return path.join(
      this.settings.getSetting("localFileStorageFolder"),
      `${fileName}`
    );
  }

  uploadVideo = async (stream: Readable) => {
    const id = randomUUID();
    await this.ensureFolder();
    await pipelineAsync(stream, createWriteStream(this.getPathForId(id)));
    return id;
  };

  pushVideoToDestination = async (fileId: string) => {
    // for now only works with files already uploaded
    return { recordingId: fileId, startTime: new Date() };
  };

  getVideo = async (id: string): Promise<Buffer> => {
    this.checkFileName(id);

    return readFile(this.getPathForId(id));
  };

  getVideoStream = async (
    idWithExtension: string,
    start: number,
    end: number
  ): Promise<Readable> => {
    this.checkFileName(idWithExtension.replace(".mp4", ""));

    return createReadStream(this.getPathForFileName(idWithExtension), {
      start,
      end,
    });
  };

  getVideoSize = async (idWithExtension: string): Promise<number> => {
    this.checkFileName(idWithExtension.replace(".mp4", ""));
    return (await statAsync(this.getPathForFileName(idWithExtension))).size;
  };

  isVideoReady = async (id: string): Promise<boolean> => {
    return true;
  };
}
