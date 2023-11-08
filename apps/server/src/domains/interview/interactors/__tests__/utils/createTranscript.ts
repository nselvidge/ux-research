import { SerializedTranscript } from "../../serializers/SerializedTranscript";

export const createPendingTranscript = (): SerializedTranscript => ({
  id: "0",
  isPending: true,
  groups: [],
});

export const createTranscriptGroup = ({
  groupNumber = 0,
  words = 1,
  startTime = 0,
}: {
  groupNumber?: number;
  words?: number;
  startTime?: number;
}) => ({
  groupNumber,
  transcriptId: "0",
  start: startTime,
  end: startTime + words * 200,
  speakerId: "abc123",
  text: "First",
  words: [...Array(words)].map((_, i) => ({
    transcriptId: "0",
    start: startTime + i * 200,
    end: startTime + (i + 1) * 200 - 1,
    wordNumber: i,
    groupNumber,
    text: "First",
  })),
});

export const createTranscript = ({
  groups = 1,
  wordsPerGroup = 1,
}: {
  groups?: number;
  wordsPerGroup?: number;
}): SerializedTranscript => ({
  id: "0",
  isPending: false,
  groups: [...Array(groups)].map((_, i) =>
    createTranscriptGroup({
      groupNumber: i,
      words: wordsPerGroup,
      startTime: wordsPerGroup * 200 * i,
    })
  ),
});
