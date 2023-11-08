import { Tag } from "./Tag";
import { Transcript } from "./Transcript";
import { WordRange } from "./WordRange";

export interface SuggestedHighlight {
  id: string;
  transcriptId: string;
  highlightedRange: WordRange;
  transcript: Transcript;
  tags: Tag[];
  status: "pending" | "approved" | "rejected";
}

export const createSuggestedHighlight = ({
  id,
  transcriptId,
  highlightedRange,
  transcript,
  tags,
  status = "pending",
}: {
  id: string;
  transcriptId: string;
  highlightedRange: WordRange;
  transcript: Transcript;
  tags: Tag[];
  status?: "pending" | "approved" | "rejected";
}): SuggestedHighlight => ({
  id,
  transcriptId,
  highlightedRange,
  transcript,
  tags,
  status,
});

export const updateStatus = (
  suggestedHighlight: SuggestedHighlight,
  status: "pending" | "approved" | "rejected"
): SuggestedHighlight => ({
  ...suggestedHighlight,
  status,
});
