import { randomUUID } from "crypto";
import { failure, isFailure, Result, success, unwrap } from "../utils/Result";
import {
  updateHighlightWithTranscript,
  Highlight,
  HighlightPendingTranscript,
  createHighlight,
  updateHighlight,
  addTagToHighlight,
  addTagsToHighlight,
  removeTagsFromHighlight,
  addVideoIdToHighlight,
} from "./Highlight";
import {
  createNewSummary,
  InterviewSummary,
  updateSummary,
} from "./InterviewSummary";
import {
  createSuggestedHighlight,
  SuggestedHighlight,
  updateStatus,
} from "./SuggestedHighlight";
import { Tag } from "./Tag";
import { PendingTranscript, Transcript, TranscriptWord } from "./Transcript";
import { WordRange } from "./WordRange";

class InvalidHighlightError extends Error {
  constructor() {
    super("Invalid highlight added to interview");
  }
}

class InvalidWordPointerError extends Error {
  constructor({ group, word }: { group: number; word: number }) {
    super(`Invalid pointer provided for word. group ${group} word ${word} `);
  }
}

export type InterviewSourcePlatform = "zoom" | "upload" | "recall" | "zoomV2";

export interface InterviewSource {
  platform: InterviewSourcePlatform;
  sourceId: string;
}

export enum InterviewStatus {
  PendingRecording,
  PendingTranscript,
  Ready,
}

type AnyInterview =
  | PendingRecordingInterview
  | PendingTranscriptInterview
  | Interview;

export const isInterviewSourcePlatform = (
  value: string
): value is InterviewSourcePlatform =>
  value === "zoom" || value === "upload" || value === "recall";

export const isInterviewPendingRecording = (
  interview: AnyInterview
): interview is PendingRecordingInterview =>
  interview.status === InterviewStatus.PendingRecording;

export const isInterviewPendingTranscript = (
  interview: AnyInterview
): interview is PendingTranscriptInterview =>
  interview.status === InterviewStatus.PendingTranscript;

export const isInterview = (interview: AnyInterview): interview is Interview =>
  interview.status === InterviewStatus.Ready;

export interface AddTimestampHighlightEvent {
  highlight: { id: string; timestamp: Date; tagIds: string[] };
  interviewId: string;
}

export interface AddCompletedTranscriptEvent {
  highlights: {
    id: string;
    highlightedRange: {
      transcriptId: string;
      startWord: { groupNumber: number; wordNumber: number };
    };
  };
}

export interface PendingRecordingInterview {
  readonly status: InterviewStatus.PendingRecording;
  id: string;
  name: string;
  workspaceId: string;
  highlights: HighlightPendingTranscript[];
  date: Date;
  creatorId: string;
  createdAt: Date;
  source: InterviewSource | null;
  projectId: string | null;
}
export const createNewPendingRecordingInterview = ({
  id = randomUUID(),
  name,
  creatorId,
  workspaceId,
  date = new Date(),
  source = null,
  projectId = null,
}: {
  id?: string;
  name: string;
  creatorId: string;
  workspaceId: string;
  date?: Date;
  source?: InterviewSource | null;
  projectId?: string | null;
}): PendingRecordingInterview => ({
  status: InterviewStatus.PendingRecording,
  id,
  name,
  date,
  creatorId,
  createdAt: new Date(),
  source,
  workspaceId,
  highlights: [],
  projectId,
});

export const interviewIsStale = (
  interview: PendingRecordingInterview | PendingTranscriptInterview | Interview,
  staleTime: number
): boolean => {
  if (isInterview(interview)) {
    return false;
  }
  const now = new Date();
  const timeSinceCreation = now.getTime() - interview.createdAt.getTime();

  return timeSinceCreation > staleTime;
};

export const updateName = <
  T extends PendingRecordingInterview | PendingTranscriptInterview | Interview
>(
  interview: T,
  name: string
): T => {
  return {
    ...interview,
    name,
  };
};

export const addRecordingToPendingInterview = (
  interview: PendingRecordingInterview,
  recordingId: string,
  startTime: Date,
  transcript: Transcript | PendingTranscript
): Interview | PendingTranscriptInterview => {
  return transcript.isPending
    ? {
        ...interview,
        status: InterviewStatus.PendingTranscript,
        recordingId,
        transcript,
        highlights: interview.highlights,
      }
    : {
        ...interview,
        status: InterviewStatus.Ready,
        recordingId,
        highlights: interview.highlights.map((highlight) =>
          updateHighlightWithTranscript(highlight, transcript, startTime)
        ),
        transcript,
        summary: null,
        suggestedHighlights: [],
      };
};

export const addTimestampHighlightToPendingInterview = (
  interview: PendingRecordingInterview,
  timestamp: Date,
  tag?: Tag
): [PendingRecordingInterview, AddTimestampHighlightEvent] => {
  const newHighlight: HighlightPendingTranscript = {
    id: randomUUID(),
    timestamp,
    tags: tag ? [tag] : [],
  };

  return [
    {
      ...interview,
      highlights: interview.highlights.concat([newHighlight]),
    },
    {
      highlight: {
        id: newHighlight.id,
        tagIds: newHighlight.tags.map((tag) => tag.id),
        timestamp: newHighlight.timestamp,
      },
      interviewId: interview.id,
    },
  ];
};

export interface PendingTranscriptInterview {
  status: InterviewStatus.PendingTranscript;
  id: string;
  name: string;
  recordingId: string;
  highlights: HighlightPendingTranscript[];
  workspaceId: string;
  date: Date;
  creatorId: string;
  source: InterviewSource | null;
  transcript: PendingTranscript;
  createdAt: Date;
  projectId: string | null;
}

export const addCompletedTranscriptToInterview = (
  interview: PendingTranscriptInterview,
  transcript: Transcript,
  recordingStartTime: Date
): Interview => {
  const highlights = interview.highlights.map((highlight) =>
    updateHighlightWithTranscript(highlight, transcript, recordingStartTime)
  );

  return {
    ...interview,
    status: InterviewStatus.Ready,
    transcript,
    highlights,
    summary: null,
    suggestedHighlights: [],
  };
};

export interface Interview {
  status: InterviewStatus.Ready;
  id: string;
  name: string;
  recordingId: string;
  highlights: Highlight[];
  workspaceId: string;
  date: Date;
  creatorId: string;
  source: InterviewSource | null;
  transcript: Transcript;
  createdAt: Date;
  summary: InterviewSummary | null;
  suggestedHighlights: SuggestedHighlight[];
  projectId: string | null;
}

export const addHighlightToInterview = (
  interview: Interview,
  newHighlight: Highlight
): Result<Interview, InvalidHighlightError> => {
  if (newHighlight.highlightedRange.transcript.id !== interview.transcript.id) {
    return failure(new InvalidHighlightError());
  }

  return success({
    ...interview,
    highlights: [...interview.highlights, newHighlight],
  });
};

export const getWordInInterviewAt = (
  interview: Interview,
  { wordNumber, groupNumber }: { wordNumber: number; groupNumber: number }
): Result<TranscriptWord, InvalidWordPointerError> => {
  const word = interview.transcript.groups[groupNumber].words[wordNumber];

  if (!word) {
    return failure(
      new InvalidWordPointerError({ word: wordNumber, group: groupNumber })
    );
  }

  return success(word);
};

export const getWordRangeOnInterview = (
  interview: Interview,
  startWord: { wordNumber: number; groupNumber: number },
  endWord: { wordNumber: number; groupNumber: number }
): Result<WordRange, InvalidWordPointerError> => {
  const start = getWordInInterviewAt(interview, startWord);
  const end = getWordInInterviewAt(interview, endWord);

  if (isFailure(start)) {
    return start;
  } else if (isFailure(end)) {
    return end;
  }

  return success(
    WordRange.createWordRange({
      transcript: interview.transcript,
      startWord: start.value,
      endWord: end.value,
    })
  );
};

export const createHighlightOnInterviewTranscript = (
  interview: Interview,
  startWord: { wordNumber: number; groupNumber: number },
  endWord: { wordNumber: number; groupNumber: number },
  tags: Tag[] = []
) => {
  if (tags.some(({ workspaceId }) => workspaceId !== interview.workspaceId)) {
    throw new Error(`Invalid tag provided to create highlight.`);
  }

  const wordRange = unwrap(
    getWordRangeOnInterview(interview, startWord, endWord)
  );
  const highlight = createHighlight({
    id: randomUUID(),
    highlightedRange: wordRange,
    tags,
    transcript: wordRange.transcript.createPartialTranscript(
      wordRange.startWord.start,
      wordRange.endWord.end
    ),
    videoId: null,
    originSuggestionId: null,
  });

  const newInterview = unwrap(addHighlightToInterview(interview, highlight));

  return [newInterview, highlight] as const;
};

export const interviewHasSpeaker = (interview: Interview, id: string) =>
  interview.transcript.hasSpeaker(id);

export const updateHighlightOnInterview = (
  interview: Interview,
  highlightId: string,
  startTime: number,
  endTime: number
) => {
  const highlight = interview.highlights.find(({ id }) => highlightId === id);
  if (!highlight || !highlight.highlightedRange) {
    throw new Error("invalid highlight, could not edit");
  }

  const newHighlight = updateHighlight(highlight, startTime, endTime);

  return {
    highlight: newHighlight,
    interview: {
      ...interview,
      highlights: interview.highlights.map((hl) =>
        hl.id === newHighlight.id ? newHighlight : hl
      ),
    },
  };
};

export const addTagToHighlightOnInterview = (
  interview: Interview,
  highlightId: string,
  tag: Tag
) => {
  if (interview.workspaceId !== tag.workspaceId) {
    throw new Error("tag does not belong to same workspace as interview");
  }

  const highlight = interview.highlights.find(
    (current) => current.id === highlightId
  );

  if (!highlight) {
    throw new Error("highlight does not exist on interview");
  }

  return addTagToHighlight(highlight, tag);
};

export const addTagsToHighlightOnInterview = (
  interview: Interview,
  highlightId: string,
  tags: Tag[]
) => {
  if (tags.some(({ workspaceId }) => workspaceId !== interview.workspaceId)) {
    throw new Error(`Invalid tag provided to addTagsToHighlight.`);
  }

  const highlight = interview.highlights.find(
    (current) => current.id === highlightId
  );

  if (!highlight) {
    throw new Error("highlight does not exist on interview");
  }

  return addTagsToHighlight(highlight, tags);
};

export const removeTagsFromHighlightOnInterview = (
  interview: Interview,
  highlightId: string,
  tags: Tag[]
) => {
  if (tags.some(({ workspaceId }) => workspaceId !== interview.workspaceId)) {
    throw new Error(`Invalid tag provided to addTagsToHighlight.`);
  }

  const highlight = interview.highlights.find(
    (current) => current.id === highlightId
  );

  if (!highlight) {
    throw new Error("highlight does not exist on interview");
  }

  return removeTagsFromHighlight(highlight, tags);
};

export const removeHighlightOnInterview = (
  interview: Interview,
  highlightId: string
) => {
  const highlight = interview.highlights.find(
    (current) => current.id === highlightId
  );

  if (!highlight) {
    return null;
  }

  return {
    removedHighlight: highlight,
    interview: {
      ...interview,
      highlights: interview.highlights.filter(({ id }) => id !== highlightId),
    },
  };
};

export const updateHighlightsOnInterview = (
  interview: Interview,
  highlights: Highlight[]
) => ({
  ...interview,
  highlights,
});

export const addVideoToHighlightOnInterview = (
  interview: Interview,
  highlightId: string,
  videoId: string
) => {
  const highlight = interview.highlights.find(
    (current) => current.id === highlightId
  );

  if (!highlight) {
    throw new Error("highlight does not exist on interview");
  }

  const updated = addVideoIdToHighlight(highlight, videoId);

  return {
    interview: {
      ...interview,
      highlights: interview.highlights.map((highlight) =>
        highlight.id === updated.id ? updated : highlight
      ),
    },
    highlight: updated,
  };
};

export const addGeneratedSummaryToInterview = (
  interview: Interview,
  text: string
) => {
  if (!interview.summary) {
    const summary = createNewSummary(text, false);
    return {
      interview: {
        ...interview,
        summary,
      },
      createSummary: summary,
    };
  }
  const summary = updateSummary(interview.summary, text);

  return {
    interview: {
      ...interview,
      summary,
    },
    updateSummary: summary,
  };
};

export interface CreateSummaryEvent {
  interview: Interview;
  createSummary: InterviewSummary;
}

export interface UpdateSummaryEvent {
  interview: Interview;
  updateSummary: InterviewSummary;
}

export const updateSummaryOnInterview = (
  interview: Interview,
  text: string
): CreateSummaryEvent | UpdateSummaryEvent => {
  if (!interview.summary) {
    const summary = createNewSummary(text, false);
    return {
      interview: {
        ...interview,
        summary,
      },
      createSummary: summary,
    };
  }
  const summary = updateSummary(interview.summary, text);

  return {
    interview: {
      ...interview,
      summary,
    },
    updateSummary: summary,
  };
};

export interface AddSuggestedHighlightFromQuoteEvent {
  interview: Interview;
  suggestedHighlight: SuggestedHighlight | null;
  transcript: Transcript | null;
}

export const addSuggestedHighlightFromQuote = (
  interview: Interview,
  quote: string,
  tag: Tag
): AddSuggestedHighlightFromQuoteEvent => {
  const wordRange = WordRange.createWordRangeFromQuote(
    interview.transcript,
    quote
  );

  if (!wordRange) {
    return { interview, suggestedHighlight: null, transcript: null };
  }
  const transcript = wordRange.createPartialTranscript();

  const suggestedHighlight = createSuggestedHighlight({
    id: randomUUID(),
    highlightedRange: wordRange,
    tags: [tag],
    transcript,
    transcriptId: transcript.id,
  });

  return {
    interview: {
      ...interview,
      suggestedHighlights: [
        ...interview.suggestedHighlights,
        suggestedHighlight,
      ],
    },
    suggestedHighlight,
    transcript,
  };
};

const createHighlightFromSuggestedHighlight = (
  suggestedHighlight: SuggestedHighlight
): Highlight => {
  return createHighlight({
    id: randomUUID(),
    highlightedRange: WordRange.createWordRange({
      transcript: suggestedHighlight.highlightedRange.transcript,
      startWord: suggestedHighlight.highlightedRange.startWord,
      endWord: suggestedHighlight.highlightedRange.endWord,
    }),
    tags: suggestedHighlight.tags,
    transcript: suggestedHighlight.transcript.createCopy(),
    videoId: null,
    originSuggestionId: suggestedHighlight.id,
  });
};

interface ApproveSuggestedHighlightEvent {
  interview: Interview;
  highlight: Highlight;
  suggestedHighlight: SuggestedHighlight;
}

export const approveSuggestedHighlight = (
  interview: Interview,
  suggestedHighlightId: string
): ApproveSuggestedHighlightEvent => {
  const suggestedHighlight = interview.suggestedHighlights.find(
    (suggestedHighlight) => suggestedHighlight.id === suggestedHighlightId
  );

  if (!suggestedHighlight) {
    throw new Error("Invalid Suggested Highlight");
  }

  const highlight = createHighlightFromSuggestedHighlight(suggestedHighlight);

  const updatedStatusSuggestedHighlight = updateStatus(
    suggestedHighlight,
    "approved"
  );

  const updatedInterview = {
    ...interview,
    highlights: [...interview.highlights, highlight],
    suggestedHighlights: interview.suggestedHighlights.map(
      (suggestedHighlight) =>
        suggestedHighlight.id === updatedStatusSuggestedHighlight.id
          ? updatedStatusSuggestedHighlight
          : suggestedHighlight
    ),
  };

  return {
    interview: updatedInterview,
    highlight,
    suggestedHighlight: updatedStatusSuggestedHighlight,
  };
};

interface rejectSuggestedHighlightEvent {
  interview: Interview;
  suggestedHighlight: SuggestedHighlight;
}

export const rejectSuggestedHighlight = (
  interview: Interview,
  suggestedHighlightId: string
): rejectSuggestedHighlightEvent => {
  const suggestedHighlight = interview.suggestedHighlights.find(
    (suggestedHighlight) => suggestedHighlight.id === suggestedHighlightId
  );

  if (!suggestedHighlight) {
    throw new Error("Invalid Suggested Highlight");
  }

  const updatedStatusSuggestedHighlight = updateStatus(
    suggestedHighlight,
    "approved"
  );

  const updatedInterview = {
    ...interview,
    suggestedHighlights: interview.suggestedHighlights.map(
      (suggestedHighlight) =>
        suggestedHighlight.id === updatedStatusSuggestedHighlight.id
          ? updatedStatusSuggestedHighlight
          : suggestedHighlight
    ),
  };

  return {
    interview: updatedInterview,
    suggestedHighlight: updatedStatusSuggestedHighlight,
  };
};

export const removeInterviewFromProject = (
  interview: AnyInterview
): AnyInterview => ({
  ...interview,
  projectId: null,
});

export const addInterviewToProject = (
  interview: AnyInterview,
  projectId: string
): AnyInterview => ({
  ...interview,
  projectId,
});
