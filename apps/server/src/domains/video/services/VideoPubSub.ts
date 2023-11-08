import { VideoPublisher } from "@root/domains/interview/interactors/InteractorServices";
import { AMQPPubSub } from "@root/domains/messages/services/AMQPPubSub";
import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import { EditorPubSub } from "../interactors/EditorInteractor";

interface RecordingUploadMessage {
  externalId: string;
  userId: string;
  interviewId: string;
  sourceLabel: string;
}

enum Queues {
  TransferVideoFromSource = "TransferVideoFromSource",
  CheckRecordingStatus = "CheckRecordingStatus",
  CheckUploadStatus = "CheckUploadStatus",
  VIDEO_UPLOADED = "VIDEO_UPLOADED",
}

const isRecordingUploadMessage = (
  message: unknown
): message is RecordingUploadMessage => {
  return (
    typeof message === "object" &&
    message !== null &&
    "externalId" in message &&
    "userId" in message &&
    "interviewId" in message &&
    "sourceLabel" in message
  );
};

interface CheckRecordingStatusMessage {
  sourceId: string;
  userId: string;
  source: string;
  interviewId: string;
}

const isCheckRecordingStatusMessage = (
  message: unknown
): message is CheckRecordingStatusMessage => {
  return (
    typeof message === "object" &&
    message !== null &&
    "sourceId" in message &&
    "userId" in message &&
    "source" in message &&
    "interviewId" in message
  );
};

const isCheckUploadStatusMessage = (
  message: unknown
): message is { sourceId: string } => {
  return (
    typeof message === "object" && message !== null && "sourceId" in message
  );
};

@injectable()
export class VideoPubSub implements EditorPubSub, VideoPublisher {
  constructor(
    private pubSub: AMQPPubSub,
    @inject("Logger") private logger: Logger
  ) {}

  publishEditableAssetReady: (videoId: string) => Promise<void> = async (
    videoId
  ) => {
    await this.pubSub.publish("EditableAssetReady", videoId);
  };

  subscribeEditableAssetReady: (
    fn: (videoId: string) => Promise<void>
  ) => Promise<void> = async (fn) => {
    const handler = async (message: unknown) => {
      if (typeof message !== "string") {
        throw new Error(
          "invalid EditableAssetReady message. Expected string, got " +
            typeof message
        );
      }
      await fn(message);
    };

    await this.pubSub.subscribe("EditableAssetReady", handler);
  };

  publishUploadComplete: (message: {
    videoId: string;
    passthroughId: string;
  }) => Promise<void> = async (message) => {
    await this.pubSub.publish(Queues.VIDEO_UPLOADED, message);
  };

  publishTransferVideoFromSource = async (
    message: RecordingUploadMessage
  ): Promise<void> => {
    await this.pubSub.publish(Queues.TransferVideoFromSource, message);
  };

  onTransferVideoFromSource = async (
    fn: (
      interviewId: string,
      externalId: string,
      userId: string,
      sourceLabel: string
    ) => Promise<void>
  ) => {
    this.pubSub.subscribe(Queues.TransferVideoFromSource, async (message) => {
      if (!isRecordingUploadMessage(message)) {
        this.logger.error("invalid message send to uploadRecording queue", {
          invalidMessage: JSON.stringify(message),
        });
        return;
      }

      return await fn(
        message.interviewId,
        message.externalId,
        message.userId,
        message.sourceLabel
      );
    });

    this.logger.info("Subscribed to recording uploads");
  };

  publishCheckRecordingStatus = async (
    message: CheckRecordingStatusMessage
  ): Promise<void> => {
    await this.pubSub.publish(Queues.CheckRecordingStatus, message);
  };

  subscribeCheckRecordingStatus = async (
    fn: (message: CheckRecordingStatusMessage) => Promise<void>
  ) => {
    await this.pubSub.subscribe(
      Queues.CheckRecordingStatus,
      async (message) => {
        if (!isCheckRecordingStatusMessage(message)) {
          this.logger.error(
            "invalid message send to checkRecordingStatus queue",
            {
              invalidMessage: message,
            }
          );
          return;
        }

        return await fn(message);
      }
    );
  };

  publishCheckUploadStatus = async ({
    sourceId,
  }: {
    sourceId: string;
  }): Promise<void> => {
    await this.pubSub.publish(Queues.CheckUploadStatus, {
      sourceId,
    });
  };

  subscribeCheckUploadStatus = async (
    fn: ({ sourceId }: { sourceId: string }) => Promise<void>
  ) => {
    await this.pubSub.subscribe(Queues.CheckUploadStatus, async (message) => {
      if (!isCheckUploadStatusMessage(message)) {
        this.logger.error("invalid message send to checkUploadStatus queue", {
          invalidMessage: message,
        });
        return;
      }

      return await fn(message);
    });
  };
}
