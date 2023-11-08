import fetch from "node-fetch";
import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import {
  VideoSourceService,
  VideoStorageService,
} from "../../interview/interactors/InteractorServices";
import { RecorderProvider } from "../interactors/RecorderInteractor";
import { Readable } from "stream";
import { Settings } from "@root/global/Settings";
import pino from "pino";
import recall from "@root/global/generated/recallai"
import { object, string, array } from "yup";

@injectable()
export class RecallService implements VideoSourceService, RecorderProvider {
  public requiresAuth = true;
  private sdk = recall;
  public type = "recall" as const;
  private authHeader: string;

  constructor(
    private settings: Settings,
    @inject("Logger") private logger: pino.Logger
  ) {
    const token = this.settings.getSetting("recallNativeToken");

    if (!token) {
      throw new Error("No recall token found");
    }
    this.authHeader = `Token ${token}`;

    this.sdk.auth(`Token ${token}`);
  }

  getVideoName: (userId: string, externalId: string) => Promise<string> =
    async (userId, externalId) => {
      const bot = await this.sdk.bot_retrieve({
        id: externalId,
      });

      return bot.data.meeting_metadata?.title || "Zoom Meeting";
    };

  getVideoDate = async (userId: string, externalId: string) => {
    const bot = await this.sdk.bot_retrieve({
      id: externalId,
    });

    const recordingStartEvent = bot.data.status_changes.find(
      (change) => change.code === "in_call_recording"
    );

    if (!recordingStartEvent) {
      throw new Error("No recording start event found");
    }

    return new Date(recordingStartEvent.created_at);
  };

  getPendingVideoName: (userId: string, externalId: string) => Promise<string> =
    async (userId, externalId) => {
      return this.getVideoName(userId, externalId);
    };

  getPendingVideoDate = async (userId: string, externalId: string) => {
    return this.getVideoDate(userId, externalId);
  };

  getSpeakerData = async () => null;

  isVideoReady = async (externalId: string, userId: string) => {
    const bot = await this.sdk.bot_retrieve({
      id: externalId,
    });

    const done = bot.data.status_changes.find(
      (change) => change.code === "done"
    );

    return done !== undefined;
  };

  pushVideoToDestination = async (
    externalId: string,
    userId: string,
    videoDestination: VideoStorageService
  ) => {
    const bot = await this.sdk.bot_retrieve({
      id: externalId,
    });

    this.logger.info("getting meeting");

    const videoFile = bot.data.video_url;

    if (!videoFile) {
      this.logger.error("Invalid meeting recording: ", {
        bot,
        externalId,
        userId,
      });
      throw new Error("invalid meeting recording");
    }

    const response = await fetch(videoFile);

    const recordingId = await videoDestination.uploadVideo(
      Readable.from(response.body)
    );

    const startTime = await this.getVideoDate(userId, externalId);

    return {
      recordingId,
      startTime,
    };
  };

  recordByUrl = async ({
    url,
    userId,
    targetId,
  }: {
    url: string;
    userId: string;
    targetId: string;
  }) => {
    const jwtSecret = this.settings.getSetting("jwtSecret");

    if (!jwtSecret) {
      throw new Error("No jwt secret found");
    }

    const joinTokenJWT = jwt.sign(
      {
        userId,
        meetingId: targetId,
      },
      jwtSecret
    );

    const joinTokenUrl = `${this.settings.getSetting(
      "redirectUrl"
    )}/recall-join-token?token=${joinTokenJWT}`;

    const response = await this.sdk.bot_create({
      meeting_url: url,
      bot_name: "Resonate Notetaker",
      zoom: {
        join_token_url: joinTokenUrl,
      },
    } as any);

    if (response.status !== 201) {
      this.logger.error("Failed to create bot", {
        response,
        url,
      });

      throw new Error("Failed to create bot");
    }

    const startTime = response.data.status_changes.find(
      (change) => change.code === "ready"
    )?.created_at;

    if (!startTime) {
      throw new Error("No start time found");
    }

    return {
      externalId: response.data.id,
      title: response.data.meeting_metadata?.title || "Zoom Meeting",
      startTime: new Date(startTime),
    };
  };

  getRecorderStatus = async (externalId: string) => {
    const bot = await this.sdk.bot_retrieve({
      id: externalId,
    });

    const startEvent = bot.data.status_changes.find((change) =>
      change.code.includes("in_call")
    );

    const doneEvent = bot.data.status_changes.find((change) =>
      ["done", "call_ended"].includes(change.code)
    );

    if (startEvent && !doneEvent) {
      return "recording";
    } else if (doneEvent) {
      return "done";
    }

    return "pending";
  };

  stopRecording = async (externalId: string) => {
    await this.sdk.bot_leave_call_create({
      id: externalId,
    });

    return;
  };
}
