import {
  Interview,
  InterviewSourcePlatform,
  InterviewStatus,
  isInterview,
  isInterviewPendingTranscript,
  PendingRecordingInterview,
  PendingTranscriptInterview,
} from "@root/domains/interview/entities/Interview";
import {
  deserializeHighlight,
  deserializeHighlightPendingTranscript,
  GatewayHighlight,
  MinimalSerializedHighlight,
  serializeGatewayHighlight,
} from "./SerializedHighlight";
import {
  GatewaySummary,
  PersistenceSummary,
  serializeInterviewSummary,
} from "./SerializedInterviewSummary";
import {
  deserializeSuggestedHighlight,
  PersistenceSuggestedHighlight,
  serializeSuggestedHighlightForPersistence,
} from "./SerializedSuggestedHighlight";
import {
  deserializeTranscript,
  MinimalSerializedTranscript,
  SerializedTranscript,
  serializeTranscript,
} from "./SerializedTranscript";

export interface InterviewWithoutTranscript {
  id: string;
  name: string;
  workspaceId: string;
  date: Date;
  creatorId: string;
  highlights: MinimalSerializedHighlight[];
  suggestedHighlights: PersistenceSuggestedHighlight[];
  recordingId: string | null;
  transcript?: SerializedTranscript | null;
  createdAt: Date;
  summary?: GatewaySummary | null;
  source: {
    sourceId: string;
    platform: InterviewSourcePlatform;
  } | null;
  projectId?: string | null;
}

export type InterviewListItem = {
  id: string;
  name: string;
  workspaceId: string;
  date: Date;
  creatorId: string;
  highlights: { id: string }[];
  recordingId: string | null;
  createdAt: Date;
  projectId: string | null;
};

export type SerializedInterview = {
  id: string;
  name: string;
  date: Date;
  recordingId: string | null;
  transcript: SerializedTranscript | null;
  highlights: GatewayHighlight[];
  suggestedHighlights: PersistenceSuggestedHighlight[];
  workspaceId: string;
  creatorId: string;
  createdAt: Date;
  summary: GatewaySummary | null;
  source: {
    sourceId: string;
    platform: InterviewSourcePlatform;
  } | null;
  projectId: string | null;
};

export type MinimalSerializedInterview = {
  id: string;
  name: string;
  date: Date;
  recordingId: string | null;
  transcript: MinimalSerializedTranscript | null;
  highlights: MinimalSerializedHighlight[];
  suggestedHighlights: PersistenceSuggestedHighlight[];
  workspaceId: string;
  creatorId: string;
  createdAt: Date;
  summary: PersistenceSummary | null;
  source: {
    sourceId: string;
    platform: InterviewSourcePlatform;
  } | null;
  projectId: string | null;
};

export type InterviewDetailsForHighlight = {
  id: string;
  name: string;
  createdAt: Date;
  projectId: string | null;
};

export type GatewayInterview =
  | InterviewWithoutTranscript
  | InterviewDetailsForHighlight
  | InterviewListItem;

export const isInterviewWithoutTranscript = (
  interview: GatewayInterview
): interview is InterviewWithoutTranscript => {
  return (interview as InterviewWithoutTranscript).workspaceId !== undefined;
};

export type AnySerializedInterview =
  | SerializedInterview
  | MinimalSerializedInterview;

const serializeReadyInterview = ({
  id,
  name,
  recordingId,
  highlights,
  workspaceId,
  date,
  creatorId,
  source,
  transcript,
  createdAt,
  summary,
  suggestedHighlights,
  projectId,
}: Interview): SerializedInterview => ({
  id,
  name,
  recordingId,
  highlights: highlights.map(serializeGatewayHighlight),
  date,
  workspaceId,
  creatorId,
  source,
  transcript: serializeTranscript(transcript),
  createdAt,
  summary: summary ? serializeInterviewSummary(summary) : null,
  suggestedHighlights: suggestedHighlights.map(
    serializeSuggestedHighlightForPersistence
  ),
  projectId,
});

const serializePendingRecordingInterview = ({
  id,
  name,
  workspaceId,
  highlights,
  date,
  creatorId,
  source,
  createdAt,
  projectId,
}: PendingRecordingInterview): SerializedInterview => ({
  id,
  name,
  recordingId: null,
  highlights: highlights.map(serializeGatewayHighlight),
  workspaceId,
  date,
  creatorId,
  source,
  transcript: null,
  createdAt,
  summary: null,
  suggestedHighlights: [],
  projectId,
});

const serializePendingTranscriptInterview = ({
  id,
  name,
  recordingId,
  workspaceId,
  highlights,
  date,
  creatorId,
  source,
  transcript,
  createdAt,
  projectId,
}: PendingTranscriptInterview): SerializedInterview => ({
  id,
  name,
  recordingId,
  highlights: highlights.map(serializeGatewayHighlight),
  workspaceId,
  date,
  creatorId,
  source,
  transcript: serializeTranscript(transcript),
  createdAt,
  summary: null,
  suggestedHighlights: [],
  projectId,
});

export const serializeInterview = (
  interview: Interview | PendingRecordingInterview | PendingTranscriptInterview
): SerializedInterview =>
  isInterview(interview)
    ? serializeReadyInterview(interview)
    : isInterviewPendingTranscript(interview)
    ? serializePendingTranscriptInterview(interview)
    : serializePendingRecordingInterview(interview);

export const deserializeInterview = ({
  id,
  recordingId,
  highlights,
  name,
  workspaceId,
  date,
  creatorId,
  source,
  transcript,
  createdAt,
  summary,
  suggestedHighlights,
  projectId,
}: MinimalSerializedInterview):
  | Interview
  | PendingTranscriptInterview
  | PendingRecordingInterview => {
  if (!recordingId) {
    return {
      status: InterviewStatus.PendingRecording,
      id,
      name,
      workspaceId,
      date,
      highlights: highlights.map(deserializeHighlightPendingTranscript),
      creatorId,
      source,
      createdAt,
      projectId,
    };
  }

  const transcriptEntity = transcript
    ? deserializeTranscript(transcript)
    : undefined;

  if (transcriptEntity === undefined) {
    throw new Error("Interview transcript is undefined");
  }

  if (transcriptEntity.isPending) {
    return {
      status: InterviewStatus.PendingTranscript,
      id,
      name,
      recordingId,
      date,
      highlights: highlights.map(deserializeHighlightPendingTranscript),
      workspaceId,
      creatorId,
      source,
      transcript: transcriptEntity,
      createdAt,
      projectId,
    };
  }

  return {
    status: InterviewStatus.Ready,
    id,
    name,
    recordingId,
    date,
    highlights: highlights.map((highlight) =>
      deserializeHighlight(highlight, transcriptEntity)
    ),
    workspaceId,
    creatorId,
    source,
    transcript: transcriptEntity,
    createdAt,
    summary: summary ? serializeInterviewSummary(summary) : null,
    suggestedHighlights: suggestedHighlights.map((suggestedHighlight) =>
      deserializeSuggestedHighlight(suggestedHighlight, transcriptEntity)
    ),
    projectId,
  };
};
