import { filter, first, flatMap, last, map, pipe, prop } from "remeda";
import { failure, Result, success } from "../utils/Result";
import { Transcript, TranscriptWord } from "./Transcript";

class EmptyWordArrayError extends Error {
  readonly code = "EMPTY_WORD_ARAY";
  constructor() {
    super("sentence has no words, cannot create WordRange");
  }
}

const getComparison = (groupNumber: number, wordNumber: number) =>
  groupNumber * 10000000 + wordNumber;

const standardizeWord = (word: string) =>
  word
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

const fullQuoteFollowsWord = (
  words: TranscriptWord[],
  wordIndex: number,
  quote: string[]
) => {
  for (let i = 0; i < quote.length; i++) {
    if (
      standardizeWord(words[wordIndex + i].text) !== standardizeWord(quote[i])
    ) {
      return false;
    }
  }
  return true;
};

export class WordRange {
  private constructor(
    public transcript: Transcript,
    public startWord: TranscriptWord,
    public endWord: TranscriptWord
  ) {}

  static createWordRange({
    transcript,
    startWord,
    endWord,
  }: {
    transcript: Transcript;
    startWord: TranscriptWord;
    endWord: TranscriptWord;
  }) {
    if (
      startWord.groupNumber > endWord.groupNumber ||
      (startWord.groupNumber === endWord.groupNumber &&
        startWord.wordNumber > endWord.wordNumber)
    ) {
      throw new Error("invalid word range");
    }

    return new WordRange(transcript, startWord, endWord);
  }

  static fromWords(
    transcript: Transcript,
    words: TranscriptWord[]
  ): Result<WordRange, EmptyWordArrayError> {
    const startWord = first(words);
    const endWord = last(words);
    if (!startWord || !endWord) {
      return failure(new EmptyWordArrayError());
    }

    return success(new WordRange(transcript, startWord, endWord));
  }

  static createWordRangeFromQuote = (
    transcript: Transcript,
    quote: string
  ): WordRange | null => {
    // remove speaker from quote
    // sometimes GPT can include the name of the speaker in the quote
    const quoteWithoutSpeaker = quote.replace(/^[A-Za-z\s]+: /, "");

    const words = quoteWithoutSpeaker.split(" ");
    let start: TranscriptWord | null = null;
    let end: TranscriptWord | null = null;

    const flatWords = pipe(
      transcript.groups,
      flatMap((group) => group.words)
    );

    for (let i = 0; i < flatWords.length; i++) {
      const word = flatWords[i];
      if (
        standardizeWord(word.text) === standardizeWord(words[0]) &&
        fullQuoteFollowsWord(flatWords, i, words)
      ) {
        start = word;
        end = flatWords[i + words.length - 1];
        break;
      }
    }
    const wordRange: WordRange | null =
      start && end
        ? WordRange.createWordRange({
            transcript,
            startWord: start,
            endWord: end,
          })
        : null;
    return wordRange;
  };

  update = (startTime: number, endTime: number) => {
    // the plus one is because we historically would store timestampss
    // where the end of one word was equal to the beginning of the next
    // this should be removed once we've migrated old timestamps
    const newStart = this.transcript.getWordAtTimestamp(startTime + 1);
    const newEnd = this.transcript.getWordAtTimestamp(endTime);

    if (!newStart || !newEnd) {
      throw new Error("invalid timestamps provided");
    }

    if (newStart.start > newEnd.start) {
      throw new Error("invalid timestamps provided. End must be after start");
    }

    return WordRange.createWordRange({
      ...this,
      startWord: newStart,
      endWord: newEnd,
    });
  };

  getText = () =>
    pipe(
      this.transcript.groups,
      filter(
        ({ groupNumber }) =>
          groupNumber >= this.startWord.groupNumber &&
          groupNumber <= this.endWord.groupNumber
      ),
      flatMap(prop("words")),
      filter(
        ({ groupNumber, wordNumber }) =>
          getComparison(groupNumber, wordNumber) >=
            getComparison(
              this.startWord.groupNumber,
              this.startWord.wordNumber
            ) &&
          getComparison(groupNumber, wordNumber) <=
            getComparison(this.endWord.groupNumber, this.endWord.wordNumber)
      ),
      map(prop("text")),
      (arr) => arr.join(" ")
    );

  createPartialTranscript = () => {
    return this.transcript.createPartialTranscript(
      this.startWord.start,
      this.endWord.end
    );
  };
}
