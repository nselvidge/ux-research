import { PersistenceVideo } from "@root/domains/video/interactors/serializers/SerializedVideo";
import { GatewayHighlight } from "../../serializers/SerializedHighlight";
import { SerializedInterview } from "../../serializers/SerializedInterview";
import {
  MinimalSerializedTranscript,
  SerializedTranscript,
} from "../../serializers/SerializedTranscript";
import { createTranscript } from "./createTranscript";

export const createPendingHighlight = ({
  timestamp,
}: {
  timestamp?: number;
}): GatewayHighlight => ({
  id: "0",
  timestamp: timestamp ? new Date(timestamp) : undefined,
  tags: [],
  transcript: null,
  videoId: null,
  originSuggestionId: null,
});

export const createHighlight = ({
  transcript = createTranscript({}),
  start = 0,
  end = 1,
}: {
  transcript?: MinimalSerializedTranscript;
  start?: number;
  end?: number;
}): GatewayHighlight => ({
  id: "abc123",
  highlightedRange: {
    startWord: transcript.groups[0].words[start],
    endWord: transcript.groups[0].words[end],
  },
  tags: [],
  videoId: null,
  transcript: {
    ...transcript,
    groups: transcript.groups.slice(0, 1).map((group, i) => ({
      ...group,
      groupNumber: i,
      words: group.words.slice(start, end).map((word, j) => ({
        ...word,
        wordNumber: j,
        groupNumber: i,
        start: word.start - group.words[start].start,
        end: word.end - group.words[start].start,
      })),
    })),
  },
  originSuggestionId: null,
});

export const createRecording = ({
  id = "0",
  startTime = 0,
}: {
  id?: string;
  startTime?: number;
}): PersistenceVideo => ({
  id,
  startTime: new Date(startTime),
  editableAsset: null,
  playableAsset: null,
  recorder: null,
});

export const createInterview = ({
  transcript = createTranscript({}),
  startTime = 0,
  highlights = [],
  workspaceId = "abc123",
  recordingId = "abc123",
}: {
  transcript?: SerializedTranscript;
  recordingId?: string;
  startTime?: number;
  highlights?: GatewayHighlight[];
  workspaceId?: string;
}): SerializedInterview => ({
  id: "0",
  name: "Untitled Interview",
  date: new Date("01-01-2022"),
  recordingId,
  transcript,
  highlights: highlights,
  creatorId: "abc123",
  source: null,
  workspaceId,
  createdAt: new Date(startTime),
  summary: null,
  suggestedHighlights: [],
  projectId: null,
});
