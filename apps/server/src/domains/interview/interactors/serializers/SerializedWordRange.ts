import { Transcript } from "../../entities/Transcript";
import { WordRange } from "../../entities/WordRange";
import {
  SerializedTranscriptWord,
  serializeTranscriptWord,
} from "./SerializedTranscript";

export interface SerializedWordRange {
  text: string;
  startWord: SerializedTranscriptWord;
  endWord: SerializedTranscriptWord;
}

export interface MinimalSerializedWordRange {
  startWord: SerializedTranscriptWord;
  endWord: SerializedTranscriptWord;
}

export const serializeWordRange = ({
  startWord,
  endWord,
  transcript,
  getText,
}: WordRange): SerializedWordRange => ({
  text: getText(),
  startWord: serializeTranscriptWord(transcript.id, startWord),
  endWord: serializeTranscriptWord(transcript.id, endWord),
});

export const deserializeWordRange = (
  { startWord, endWord }: MinimalSerializedWordRange,
  transcript: Transcript
) => WordRange.createWordRange({ transcript, startWord, endWord });
