import { clamp, prop } from "remeda";
import { Tag } from "./Tag";
import { Transcript } from "./Transcript";
import { WordRange } from "./WordRange";

export interface HighlightPendingTranscript {
  readonly id: string;
  readonly timestamp: Date;
  tags: Tag[];
}

export const updateHighlightWithTranscript = (
  highlight: HighlightPendingTranscript,
  transcript: Transcript,
  startTime: Date
): Highlight => {
  const endTimestamp = clamp(
    highlight.timestamp.getTime() - startTime.getTime() + 15 * 1000,
    { min: 0, max: transcript.getEndOfTranscript() }
  );

  const startTimestamp = clamp(
    highlight.timestamp.getTime() - startTime.getTime() - 15 * 1000,
    { min: 0, max: transcript.getEndOfTranscript() }
  );

  const startWord = transcript.getSentenceStartBeforeTimestamp(startTimestamp);

  const endWord = transcript.getSentenceEndAfterTimestamp(endTimestamp);

  const wordRange = WordRange.createWordRange({
    transcript,
    startWord: startWord,
    endWord: endWord,
  });

  return createHighlight({
    id: highlight.id,
    highlightedRange: wordRange,
    tags: highlight.tags,
    videoId: null,
    transcript: wordRange.transcript.createPartialTranscript(
      wordRange.startWord.start,
      wordRange.endWord.end
    ),
    originSuggestionId: null,
  });
};

export interface Highlight {
  transcriptId: string;
  id: string;
  highlightedRange: WordRange;
  tags: Tag[];
  videoId: string | null;
  transcript: Transcript;
  originSuggestionId: string | null;
}

export const createHighlight = (
  highlight: Omit<Highlight, "transcriptId">
): Highlight => ({
  ...highlight,
  transcriptId: highlight.transcript.id,
});

export const updateHighlight = (
  highlight: Highlight,
  startTime: number,
  endTime: number
): Highlight => {
  const newRange = highlight.highlightedRange.update(startTime, endTime);
  const newTranscript = newRange.transcript.createPartialTranscript(
    newRange.startWord.start,
    newRange.endWord.end
  );

  return {
    ...highlight,
    highlightedRange: newRange,
    transcript: newTranscript,
  };
};

export const addTagsToHighlight = (
  highlight: Highlight,
  tags: Tag[]
): { highlight: Highlight; newTags: Tag[] } => {
  const tagsToAdd = tags.filter(
    (tag) => !highlight.tags.map(prop("id")).includes(tag.id)
  );

  return {
    highlight: {
      ...highlight,
      tags: highlight.tags.concat(tagsToAdd),
    },
    newTags: tagsToAdd,
  };
};

export const removeTagsFromHighlight = (
  highlight: Highlight,
  tags: Tag[]
): { highlight: Highlight; removedTags: Tag[] } => {
  const removeIds = tags.map(prop("id"));

  const updatedTags = highlight.tags.filter(
    ({ id }) => !removeIds.includes(id)
  );
  const removedTags = highlight.tags.filter(({ id }) => removeIds.includes(id));

  return {
    highlight: { ...highlight, tags: updatedTags },
    removedTags,
  };
};

export const addTagToHighlight = (
  highlight: Highlight,
  tag: Tag
): { highlight: Highlight; newTag: Tag } => {
  if (highlight.tags.find((current) => current.id === tag.id)) {
    return {
      highlight: highlight,
      newTag: tag,
    };
  }

  return {
    highlight: { ...highlight, tags: highlight.tags.concat(tag) },
    newTag: tag,
  };
};

export const addVideoIdToHighlight = (
  highlight: Highlight,
  videoId: string
): Highlight => {
  return {
    ...highlight,
    videoId: videoId,
  };
};
