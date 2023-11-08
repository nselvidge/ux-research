import { randomUUID } from "crypto";
import {
  dropLast,
  filter,
  flatMap,
  groupBy,
  last,
  map,
  mapValues,
  pipe,
  prop,
  reduce,
  sortBy,
} from "remeda";
import { Participant } from "./Participant";

export interface TranscriptWord {
  isUncorrected?: false;
  groupNumber: number;
  wordNumber: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptSentence {
  groupNumber: number;
  text: string;
  words: TranscriptWord[];
}

export interface TranscriptGroup {
  groupNumber: number;
  speakerId: string;
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export interface RawTranscriptGroup {
  groupNumber: number;
  speakerLabel: string;
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export class PendingTranscript {
  public readonly isPending = true;
  constructor(public readonly id: string) {}
}

export interface RawTranscriptParsedEvent {
  transcript: Transcript;
  speakers: Participant[];
}

const fallbackGroups = [
  {
    groupNumber: 0,
    speakerLabel: "Unknown",
    start: 0,
    end: 2,
    text: "No Transcript",
    words: [
      {
        groupNumber: 0,
        wordNumber: 0,
        start: 0,
        end: 1,
        text: "No",
      },
      {
        groupNumber: 0,
        wordNumber: 1,
        start: 1,
        end: 2,
        text: "Transcript",
      },
    ],
  },
];

export interface RawTranscript {
  readonly isRaw: true;
  readonly isPending: false;
  readonly id: string;
  readonly groups: RawTranscriptGroup[];
}

export const parseRawTranscriptGroups = (
  rawTranscript: RawTranscript
): { transcript: Transcript; speakers: Participant[] } => {
  const groups =
    rawTranscript.groups.length === 0 ? fallbackGroups : rawTranscript.groups;

  const speakerLabelToId = pipe(
    groups,
    groupBy((group) => group.speakerLabel),
    mapValues(() => randomUUID())
  );

  const finalGroups = map.indexed(
    groups,
    ({ start, end, groupNumber, text, speakerLabel, words }, i) => ({
      groupNumber: groupNumber,
      text: text,
      speakerId: speakerLabelToId[speakerLabel],

      // this allows us to highlight the first word before play has started
      start: i === 0 ? 0 : start,

      // this ensures the group will last until the next group starts
      end: groups[i + 1] ? groups[i + 1].start - 1 : end,
      words: words.map((word, j) => ({
        ...word,

        // this allows us to highlight the first word before play has started
        start: i === 0 && j === 0 ? 0 : word.start,

        // this allows us to ensure a word is always highlighted
        end: words[j + 1]
          ? words[j + 1].start - 1
          : groups[i + 1]
          ? groups[i + 1].words[0].start - 1
          : word.end,
      })),
    })
  );

  const speakers: Participant[] = Object.entries(speakerLabelToId).map(
    ([label, id]) => ({ id, name: label })
  );

  return {
    transcript: Transcript.create({
      id: rawTranscript.id,
      groups: finalGroups,
    }),
    speakers,
  };
};

export class Transcript {
  public readonly isPending = false;
  private punctuation = /[.?!]/;
  private constructor(
    public readonly id: string,
    public readonly groups: TranscriptGroup[]
  ) {}

  static create = ({
    id,
    groups,
  }: {
    id: string;
    groups: TranscriptGroup[];
  }) => {
    const orderedGroups = pipe(
      groups,
      sortBy((group) => group.groupNumber),
      map((group) => ({
        ...group,
        words: sortBy(group.words, prop("wordNumber")),
      }))
    );

    const transcript = new Transcript(id, orderedGroups);

    transcript.ensureGroupOrdering();
    return transcript;
  };

  ensureGroupOrdering = () => {
    this.groups.forEach((group, index) => {
      if (group.groupNumber !== index) {
        throw new Error("group ordering must match groupNumber");
      }
      group.words.forEach((word, wordIndex) => {
        if (word.wordNumber !== wordIndex) {
          throw new Error("word ordering must match wordNumber");
        }
      });
    });
  };

  updateGroups(newGroups: TranscriptGroup[]) {
    return Transcript.create({ id: this.id, groups: newGroups });
  }

  getSentences = (): TranscriptSentence[] =>
    pipe(
      this.groups,
      flatMap((group) => group.words),
      reduce(
        (sentenceWords: TranscriptWord[][], word) => {
          const rest = dropLast(sentenceWords, 1);
          const lastSentence = last(sentenceWords) || [];
          const next = [...rest, [...lastSentence, word]];
          if (!this.punctuation.test(word.text)) {
            return next;
          }

          return [...next, []];
        },
        [[]]
      ),
      filter((sentence) => sentence.length !== 0),
      map(
        (words): TranscriptSentence => ({
          words,
          groupNumber: words[0].groupNumber,
          text: words.map(prop("text")).join(" "),
        })
      )
    );

  getEndOfTranscript = () => {
    const group = last(this.groups);
    if (!group) {
      return 0;
    }
    const word = last(group.words);
    if (!word) {
      return 0;
    }
    return word.end;
  };

  getSentenceStartBeforeTimestamp = (timestamp: number) => {
    const word = this.getWordAtTimestamp(timestamp);
    if (word.wordNumber === 0) {
      return word;
    }
    let prev = word;
    let next = word;

    for (let i = word.wordNumber - 1; i >= 0; i--) {
      next = this.groups[word.groupNumber].words[i];

      if (i === 0) {
        return next;
      }
      if (/[.?!]/.test(next.text)) {
        return prev;
      }
      prev = next;
    }

    return prev;
  };

  getSentenceEndAfterTimestamp = (timestamp: number) => {
    const word = this.getWordAtTimestamp(timestamp);
    const group = this.groups[word.groupNumber];
    if (word.wordNumber === group.words.length - 1) {
      return word;
    }

    let current = word;
    for (let i = word.wordNumber; i <= group.words.length - 1; i++) {
      current = group.words[i];

      if (/[.?!]/.test(current.text)) {
        return current;
      }
    }

    return current;
  };

  getWordAtTimestamp = (timestamp: number) => {
    const group = this.groups.find(
      (group) => group.start <= timestamp && timestamp <= group.end
    );

    const word = group?.words.find(
      (word) => word.start <= timestamp && timestamp <= word.end
    );

    if (!word) {
      throw new Error("invalid timestamp");
    }

    return word;
  };

  hasSpeaker = (id: string) =>
    this.groups.find((group) => (group.speakerId = id)) !== undefined;

  createPartialTranscript = (start: number, end: number) => {
    const groups = this.groups
      .filter((group) => group.start <= end && group.end >= start)
      .map((group, i) => {
        const words = group.words
          .filter((word) => word.start <= end && word.end >= start)
          .map((word, j) => ({
            ...word,
            groupNumber: i,
            wordNumber: j,
            start: word.start - start,
            end: word.end - start,
          }))
          .sort((a, b) => a.start - b.start);

        return {
          ...group,
          groupNumber: i,
          start: Math.max(group.start - start, 0),
          end: Math.min(group.end - start, end - start),
          words,
          text: words.map((word) => word.text).join(" "),
        };
      })
      .sort((a, b) => a.start - b.start);

    return Transcript.create({ id: randomUUID(), groups });
  };

  createCopy = () =>
    Transcript.create({ id: randomUUID(), groups: this.groups });
}
