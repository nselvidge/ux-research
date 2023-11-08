import { Readable } from "node:stream";
import { InterviewSourcePlatform } from "../entities/Interview";
import { SerializedParticipant } from "./serializers/SerializedParticipant";
import {
  RawSerializedTranscript,
  SerializedTranscript,
} from "./serializers/SerializedTranscript";

export interface VideoSourceService {
  pushVideoToDestination: (
    externalId: string,
    userId: string,
    destination: VideoStorageService
  ) => Promise<{ recordingId: string; startTime: Date }>;
  requiresAuth: boolean;
  getVideoName: (userId: string, externalId: string) => Promise<string>;
  getVideoDate: (userId: string, externalId: string) => Promise<Date>;
  getPendingVideoName: (userId: string, externalId: string) => Promise<string>;
  getPendingVideoDate: (userId: string, externalId: string) => Promise<Date>;
  isVideoReady(externalId: string, userId: string): Promise<boolean>;
}

export interface VideoStorageService {
  platform: "mux" | "s3" | "local";
  hasPublicUrl: boolean;
  uploadVideo: (stream: Readable) => Promise<string>;
  getVideoStream(
    idWithExtension: string,
    start: number,
    end: number
  ): Promise<Readable>;
  getUrlForVideo: (id: string) => Promise<string>;
  getVideoSize: (idWithExtension: string) => Promise<number>;
}

export interface TranscriptionService {
  generateTranscript: (
    videoDownloadUrl: string
  ) => Promise<RawSerializedTranscript>;
  getTranscriptById: (transcriptId: string) => Promise<RawSerializedTranscript>;
}

export interface VideoPublisher {
  publishTransferVideoFromSource(message: {
    externalId: string;
    userId: string;
    interviewId: string;
    sourceLabel: InterviewSourcePlatform;
  }): Promise<void>;
  publishCheckRecordingStatus(message: {
    sourceId: string;
    userId: string;
    source: string;
    interviewId: string;
  }): Promise<void>;
  publishCheckUploadStatus(message: { sourceId: string }): Promise<void>;
}

export interface InterviewPublisher {
  publishGenerateSummary(message: {
    interviewId: string;
    transcript: SerializedTranscript;
    speakers: SerializedParticipant[];
  }): Promise<void>;
  publishExtractQuotes(message: {
    interviewId: string;
    transcript: SerializedTranscript;
    speakers: SerializedParticipant[];
    tags: { id: string; name: string; description: string }[];
  }): Promise<void>;
}

export interface InterviewNotificationService {
  sendInterviewReadyNotification: (data: {
    interviewId: string;
    interviewName: string;
    userId: string;
    fullName: string;
    highlightCount: number;
    previewImageUrl: string | null;
  }) => Promise<void>;
}

export interface SummarizationService {
  generateSummary: (
    transcript: SerializedTranscript,
    speakers: SerializedParticipant[]
  ) => Promise<string>;
}
