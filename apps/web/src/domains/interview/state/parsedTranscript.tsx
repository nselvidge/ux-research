import { useMemo } from "react";

export interface TranscriptGroupData {
  start: number;
  end: number;
  text: string;
  speaker: { name: string; id: string };
  groupNumber: number;
  words: TranscriptWordWithHighlights[];
}

export interface TranscriptWordWithHighlights {
  id: string;
  wordNumber: number;
  groupNumber: number;
  text: string;
  start: number;
  end: number;
  charStart: number;
  charEnd: number;
}

type InputWord = Omit<TranscriptWordWithHighlights, "charStart" | "charEnd">;

export const useParsedTranscript = (transcript?: {
  groups?: {
    start: number;
    end: number;
    text: string;
    speaker: { name: string; id: string };
    groupNumber: number;
    words: InputWord[];
  }[];
}) => {
  const groups = transcript?.groups;

  return useMemo(
    () =>
      groups?.map((group) => ({
        ...group,
        words: group.words.reduce((acc, word, i) => {
          const start = acc[i - 1]?.charEnd || 0;

          return acc.concat([
            {
              ...word,
              charStart: start,
              charEnd: start + word.text.length + 1,
            },
          ]);
        }, [] as TranscriptWordWithHighlights[]),
      })),

    [groups]
  );
};
