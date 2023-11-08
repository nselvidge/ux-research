import {
  createHighlight,
  Highlight,
  HighlightPendingTranscript,
} from "../../entities/Highlight";
import { Transcript } from "../../entities/Transcript";
import { InterviewDetailsForHighlight } from "./SerializedInterview";
import { deserializeTag, PersistenceTag, serializeTag } from "./SerializedTag";
import {
  deserializeTranscript,
  MinimalSerializedTranscript,
  serializeTranscript,
} from "./SerializedTranscript";
import {
  deserializeWordRange,
  MinimalSerializedWordRange,
  SerializedWordRange,
  serializeWordRange,
} from "./SerializedWordRange";

export interface SerializedHighlight {
  id: string;
  highlightedRange?: SerializedWordRange | null;
  timestamp?: Date | null;
  tags: PersistenceTag[];
  videoId: string | null;
  transcript: MinimalSerializedTranscript | null;
  originSuggestionId: string | null;
}

export interface MinimalSerializedHighlight {
  id: string;
  highlightedRange?: MinimalSerializedWordRange | null;
  timestamp?: Date | null;
  tags: PersistenceTag[];
  videoId: string | null;
  transcript: MinimalSerializedTranscript | null;
  originSuggestionId: string | null;
}

export interface HighlightWithInterviewDetails
  extends MinimalSerializedHighlight {
  interview: InterviewDetailsForHighlight;
}

export const isHighlightWithInterviewDetails = (
  highlight: GatewayHighlight
): highlight is HighlightWithInterviewDetails => {
  return (highlight as HighlightWithInterviewDetails).interview !== undefined;
};

export type GatewayHighlight =
  | MinimalSerializedHighlight
  | HighlightWithInterviewDetails;

export const serializeHighlight = ({
  id,
  highlightedRange,
  tags,
  videoId,
  transcript,
  originSuggestionId,
}: Highlight): SerializedHighlight => ({
  id,
  highlightedRange: serializeWordRange(highlightedRange),
  tags: tags.map(serializeTag),
  videoId,
  transcript: serializeTranscript(transcript),
  originSuggestionId,
});

const isHighlight = (
  highlight: Highlight | HighlightPendingTranscript
): highlight is Highlight => {
  return (highlight as Highlight).highlightedRange !== undefined;
};

export const serializeGatewayHighlight = (
  highlight: Highlight | HighlightPendingTranscript
): GatewayHighlight => ({
  id: highlight.id,
  highlightedRange: isHighlight(highlight)
    ? serializeWordRange(highlight.highlightedRange)
    : null,
  tags: highlight.tags.map(serializeTag),
  transcript: isHighlight(highlight)
    ? serializeTranscript(highlight.transcript)
    : null,
  videoId: isHighlight(highlight) ? highlight.videoId : null,
  timestamp: isHighlight(highlight) ? null : highlight.timestamp,
  originSuggestionId: isHighlight(highlight)
    ? highlight.originSuggestionId
    : null,
});

export const deserializeHighlightPendingTranscript = ({
  id,
  timestamp,
  tags,
}: MinimalSerializedHighlight): HighlightPendingTranscript => {
  if (!timestamp) {
    throw new Error(
      "cannot deserialize highlightPendingTranscript, highlight missing timestamp"
    );
  }
  return {
    id,
    timestamp,
    tags: tags.map(deserializeTag),
  };
};

export const deserializeHighlight = (
  {
    id,
    highlightedRange,
    tags,
    videoId,
    transcript: highlightTranscript,
    originSuggestionId,
  }: MinimalSerializedHighlight,
  transcript: Transcript
): Highlight => {
  const highlightTranscriptEntity = highlightTranscript
    ? deserializeTranscript(highlightTranscript)
    : null;

  if (!highlightedRange || !highlightTranscriptEntity) {
    throw new Error(
      "cannot deserialize highlight, highlight missing highlightedRange"
    );
  }

  if (highlightTranscriptEntity.isPending) {
    throw new Error(
      "cannot deserialize highlight, highlight transcript is pending"
    );
  }

  return createHighlight({
    id,
    highlightedRange: deserializeWordRange(highlightedRange, transcript),
    tags: tags.map(deserializeTag),
    videoId,
    transcript: highlightTranscriptEntity,
    originSuggestionId,
  });
};
