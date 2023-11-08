import { SuggestedHighlight } from "../../entities/SuggestedHighlight";
import { Transcript } from "../../entities/Transcript";
import { deserializeTag, PersistenceTag, serializeTag } from "./SerializedTag";
import {
  deserializeTranscript,
  MinimalSerializedTranscript,
  serializeTranscript,
} from "./SerializedTranscript";
import {
  deserializeWordRange,
  MinimalSerializedWordRange,
  serializeWordRange,
} from "./SerializedWordRange";

export interface PersistenceSuggestedHighlight {
  id: string;
  transcriptId: string;
  transcript: MinimalSerializedTranscript;
  highlightedRange: MinimalSerializedWordRange;
  tags: PersistenceTag[];
  status: "pending" | "approved" | "rejected";
}

export const serializeSuggestedHighlightForPersistence = (
  suggestedHighlight: SuggestedHighlight
): PersistenceSuggestedHighlight => ({
  id: suggestedHighlight.id,
  transcriptId: suggestedHighlight.transcriptId,
  transcript: serializeTranscript(suggestedHighlight.transcript),
  highlightedRange: serializeWordRange(suggestedHighlight.highlightedRange),
  tags: suggestedHighlight.tags.map(serializeTag),
  status: suggestedHighlight.status,
});

export const deserializeSuggestedHighlight = (
  {
    id,
    transcriptId,
    highlightedRange,
    tags,
    status,
    transcript,
  }: PersistenceSuggestedHighlight,
  interviewTranscript: Transcript
): SuggestedHighlight => {
  const transcriptEntity = deserializeTranscript(transcript);
  if (transcriptEntity.isPending) {
    throw new Error("Suggested highlight transcript cannot be pending");
  }

  return {
    id,
    transcriptId,
    transcript: transcriptEntity,
    highlightedRange: deserializeWordRange(
      highlightedRange,
      interviewTranscript
    ),
    tags: tags.map(deserializeTag),
    status,
  };
};
