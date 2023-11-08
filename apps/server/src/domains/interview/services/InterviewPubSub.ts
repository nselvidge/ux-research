import { AMQPPubSub } from "@root/domains/messages/services/AMQPPubSub";
import { Logger } from "@root/global/logger";
import { flatMap, indexBy, map, pipe, reduce } from "remeda";
import { injectable, inject } from "tsyringe";
import { InterviewPublisher } from "../interactors/InteractorServices";
import { SerializedParticipant } from "../interactors/serializers/SerializedParticipant";
import { SerializedTranscript } from "../interactors/serializers/SerializedTranscript";

const GENERATE_SUMMARY = "GENERATE_SUMMARY";
const SUMMARY_READY = "SUMMARY_READY";
const CHECK_INTERVIEWS = "CHECK_INTERVIEWS";
const EXTRACT_QUOTES = "EXTRACT_QUOTES";
const EXTRACTED_QUOTES_READY = "EXTRACTED_QUOTES_READY";

interface ExtractedQuotesReadyMessage {
  quotes: {
    quote: string;
    tag: string;
  }[];
  documentId: string;
}

interface SummaryReadyMessage {
  summary: string;
  documentId: string;
}

interface CallbackSummaryReadyMessage {
  summary: string;
  interviewId: string;
}

interface VideoUploadedMessage {
  videoId: string;
  passthroughId: string;
}

const isVideoUploadedMessage = (data: unknown): data is VideoUploadedMessage =>
  typeof data === "object" &&
  data !== null &&
  "videoId" in data &&
  "passthroughId" in data;

const isSummaryReadyMessage = (data: unknown): data is SummaryReadyMessage =>
  typeof data === "object" &&
  data !== null &&
  "summary" in data &&
  "documentId" in data;

const isExtractedQuotesReadyMessage = (
  data: unknown
): data is ExtractedQuotesReadyMessage =>
  typeof data === "object" &&
  data !== null &&
  "quotes" in data &&
  "documentId" in data;

const transcriptToDocument = (
  transcript: SerializedTranscript,
  speakerDict: { [speakerId: string]: SerializedParticipant }
) =>
  pipe(
    transcript.groups,
    flatMap((group) =>
      group.words.map((word) => ({ ...word, speakerId: group.speakerId }))
    ),
    reduce((acc, word) => {
      const lastSentence = acc[acc.length - 1];
      if (
        lastSentence &&
        lastSentence[lastSentence.length - 1]?.speakerId === word.speakerId &&
        !/[.?!]/.test(lastSentence[lastSentence.length - 1]?.text)
      ) {
        lastSentence.push(word);
      } else {
        acc.push([word]);
      }
      return acc;
    }, [] as { speakerId: string; text: string }[][]),
    map((words) => {
      const speaker = speakerDict[words[0].speakerId];
      return `${speaker.name}: ${words.map((word) => word.text).join(" ")}`;
    })
  ).join("\n");

@injectable()
export class InterviewPubSub implements InterviewPublisher {
  constructor(
    private pubsub: AMQPPubSub,
    @inject("Logger") private logger: Logger
  ) {}

  scheduleHeartbeat = (minuteFrequency: number) => {
    this.pubsub.publishOnInterval(
      CHECK_INTERVIEWS,
      {},
      `*/${minuteFrequency} * * * *`
    );
  };

  subscribeToCheckInterviews = (callback: (data: unknown) => Promise<void>) => {
    this.pubsub.subscribe(CHECK_INTERVIEWS, callback);
  };

  subscribeToVideoUploaded = (
    callback: (data: VideoUploadedMessage) => Promise<void>
  ) => {
    const wrappedCallback = async (data: unknown) => {
      if (!isVideoUploadedMessage(data)) {
        this.logger.error("invalid message sent to VIDEO_UPLOADED", {
          message: data,
        });
        return;
      }

      return callback(data);
    };

    this.pubsub.subscribe("VIDEO_UPLOADED", wrappedCallback);
  };

  subscribeToSummaryReady = (
    callback: (data: CallbackSummaryReadyMessage) => Promise<void>
  ) => {
    const wrappedCallback = async (data: unknown) => {
      if (!isSummaryReadyMessage(data)) {
        this.logger.error("invalid message sent to " + SUMMARY_READY, {
          invalidMessage: JSON.stringify(data),
        });
        return;
      }

      const callbackData = {
        summary: data.summary,
        interviewId: data.documentId,
      };

      return callback(callbackData);
    };

    this.pubsub.subscribe(SUMMARY_READY, wrappedCallback);
    this.logger.info("subscribed to " + SUMMARY_READY);
  };

  publishGenerateSummary = async ({
    interviewId,
    transcript,
    speakers,
  }: {
    interviewId: string;
    transcript: SerializedTranscript;
    speakers: SerializedParticipant[];
  }) => {
    this.logger.info("publishing " + GENERATE_SUMMARY, {
      interviewId,
    });
    const speakerDict = indexBy(speakers, (speaker) => speaker.id);

    // group words into sentences and start each sentence with the speaker name on a new line
    const document = transcriptToDocument(transcript, speakerDict);

    this.pubsub.publish(GENERATE_SUMMARY, {
      documentId: interviewId,
      text: document,
    });
  };

  publishExtractQuotes = async ({
    interviewId,
    transcript,
    speakers,
    tags,
  }: {
    interviewId: string;
    transcript: SerializedTranscript;
    speakers: SerializedParticipant[];
    tags: { id: string; name: string; description: string }[];
  }) => {
    this.logger.info("publishing " + EXTRACT_QUOTES, {
      interviewId,
    });
    const speakerDict = indexBy(speakers, (speaker) => speaker.id);

    // group words into sentences and start each sentence with the speaker name on a new line
    const document = transcriptToDocument(transcript, speakerDict);

    this.pubsub.publish(EXTRACT_QUOTES, {
      documentId: interviewId,
      text: document,
      tags,
    });
  };

  subscribeToExtractedQuotesReady = (
    callback: (data: ExtractedQuotesReadyMessage) => Promise<void>
  ) => {
    const wrappedCallback = async (data: unknown) => {
      if (!isExtractedQuotesReadyMessage(data)) {
        this.logger.error("invalid message sent to " + EXTRACTED_QUOTES_READY, {
          invalidMessage: JSON.stringify(data),
        });
        return;
      }

      return callback(data);
    };

    this.pubsub.subscribe(EXTRACTED_QUOTES_READY, wrappedCallback);
    this.logger.info("subscribed to " + EXTRACTED_QUOTES_READY);
  };
}
