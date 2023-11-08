import { VideoStorageService } from "@root/domains/interview/interactors/InteractorServices";
import {
  GetObjectAttributesCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";
import { Readable } from "node:stream";
import { injectable } from "tsyringe";
import { VideoPlaybackService } from "../interactors/CreatorInteractor";
import { Settings } from "@root/global/Settings";
import { ViewerVideoPlaybackService } from "../interactors/ViewerInteractor";

@injectable()
export class S3Service
  implements
    VideoStorageService,
    VideoPlaybackService,
    ViewerVideoPlaybackService
{
  private videoPathPrefix = "video";
  private videoFileType = "mp4";
  private imagePathPrefix = "images";
  private imageFileType = "png";
  private baseUrl: string;
  private client = new S3Client({ region: "us-west-1" });
  private bucket: string;
  public readonly platform = "s3";

  constructor(settings: Settings) {
    this.bucket = settings.getSetting("s3VideoBucket");
    this.baseUrl = `https://${this.bucket}.s3.us-west-1.amazonaws.com`;
  }

  hasPublicUrl = true;

  getVideoStream = async (
    idWithExtension: string,
    start: number,
    end: number
  ) => {
    const res = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: this.getKeyForVideoFile(idWithExtension),
        Range: `bytes=${start}-${end}`,
      })
    );

    if (!res.Body) {
      throw new Error("failed to get video stream");
    }

    return res.Body as Readable;
  };

  getVideoSize = async (idWithExtension: string) => {
    const size = (
      await this.client.send(
        new GetObjectAttributesCommand({
          Bucket: this.bucket,
          Key: this.getKeyForVideoFile(idWithExtension),
          ObjectAttributes: ["ObjectSize"],
        })
      )
    ).ObjectSize;

    if (size === undefined) {
      throw new Error("could not get video size");
    }

    return size;
  };

  getKey = (id: string) =>
    this.getKeyForVideoFile(`${id}.${this.videoFileType}`);

  getKeyForVideoFile = (idWithExtension: string) =>
    `${this.videoPathPrefix}/${idWithExtension}`;

  getUrlForVideoFile = async (idWithExtension: string) => {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: this.getKeyForVideoFile(idWithExtension),
    });
    return await getSignedUrl(this.client, command, {
      expiresIn: 10800, // 3 hour expiration, gives enough time for the transcript and mux processing to complete
    });
  };

  getUrlForVideo = async (id: string) =>
    this.getUrlForVideoFile(`${id}.${this.videoFileType}`);

  getDownloadUrlForVideo = async (id: string) => this.getUrlForVideo(id);

  getPlayableUrlForVideo = async (id: string) => this.getUrlForVideo(id);

  async uploadVideo(stream: Readable) {
    const id = randomUUID();

    const uploader = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: `${this.videoPathPrefix}/${id}.${this.videoFileType}`,
        Body: stream,
        ContentType: "video/mp4",
      },
    });

    await uploader.done();

    return id;
  }

  getImageUrl = (id: string) =>
    `${this.baseUrl}/${this.imagePathPrefix}/${id}.${this.imageFileType}`;

  uploadImage = async (stream: Readable) => {
    const id = randomUUID();

    const uploader = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: `${this.imagePathPrefix}/${id}.${this.imageFileType}`,
        Body: stream,
        ContentType: "image/png",
      },
    });

    await uploader.done();

    return this.getImageUrl(id);
  };
}
