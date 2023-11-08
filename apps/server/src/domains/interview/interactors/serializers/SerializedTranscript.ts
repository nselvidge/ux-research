import { first, last, prop } from "remeda";
import {
  PendingTranscript,
  RawTranscript,
  Transcript,
  TranscriptWord,
} from "../../entities/Transcript";

export interface SerializedTranscriptWord {
  transcriptId: string;
  groupNumber: number;
  wordNumber: number;
  start: number;
  end: number;
  text: string;
}

export interface PersistenceSerializedTranscriptGroup {
  groupNumber: number;
  speakerId: string;
  text: string;
  words: SerializedTranscriptWord[];
}

export interface RawSerializedTranscriptGroup {
  groupNumber: number;
  speakerLabel: string;
  words: SerializedTranscriptWord[];
}

export interface SerializedTranscriptGroup {
  groupNumber: number;
  speakerId: string;
  words: SerializedTranscriptWord[];
  transcriptId: string;
  text: string;
  start: number;
  end: number;
}

export interface MinimalSerializedTranscript {
  id: string;
  groups: PersistenceSerializedTranscriptGroup[];
  isPending: boolean;
  isRaw?: false;
}

export interface TranscriptWordId {
  groupNumber: number;
  wordNumber: number;
}

export interface RawSerializedTranscript {
  id: string;
  groups: RawSerializedTranscriptGroup[];
  isPending: boolean;
  isRaw: true;
}

export interface SerializedTranscript extends MinimalSerializedTranscript {
  groups: SerializedTranscriptGroup[];
}

export const serializeTranscriptWord = (
  transcriptId: string,
  word: TranscriptWord
): SerializedTranscriptWord => ({
  ...word,
  transcriptId,
});

export const serializeTranscript = (
  transcript: Transcript | PendingTranscript
): SerializedTranscript =>
  transcript.isPending
    ? { id: transcript.id, isPending: true, groups: [] }
    : {
        id: transcript.id,
        isPending: false,
        groups: transcript.groups.map((group) => ({
          ...group,
          transcriptId: transcript.id,
          words: group.words.map((word) =>
            serializeTranscriptWord(transcript.id, word)
          ),
        })),
      };

const deserializeTranscriptGroup = (
  group: PersistenceSerializedTranscriptGroup
) => ({
  ...group,
  words: group.words.sort((a, b) => a.wordNumber - b.wordNumber),
  start: first(group.words)?.start || 0,
  end: last(group.words)?.end || 0,
  text: group.text,
});

const deserializeRawTranscriptGroup = (
  group: RawSerializedTranscriptGroup
) => ({
  ...group,
  start: first(group.words)?.start || 0,
  end: last(group.words)?.end || 0,
  text: group.words.map(prop("text")).join(" "),
});

export const deserializeRawTranscript = ({
  id,
  groups,
  isPending,
}: RawSerializedTranscript): RawTranscript | PendingTranscript =>
  isPending
    ? new PendingTranscript(id)
    : {
        id,
        groups: groups.map(deserializeRawTranscriptGroup),
        isRaw: true,
        isPending,
      };

export const deserializeTranscript = ({
  id,
  groups,
  isPending,
}: MinimalSerializedTranscript) =>
  isPending
    ? new PendingTranscript(id)
    : Transcript.create({
        id,
        groups: groups
          .sort((a, b) => a.groupNumber - b.groupNumber)
          .map(deserializeTranscriptGroup),
      });
