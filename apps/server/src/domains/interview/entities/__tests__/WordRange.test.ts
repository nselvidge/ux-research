import { WordRange } from "../WordRange";
import { createTranscriptFromText } from "./utils";

const transcript = createTranscriptFromText(
  "Speaker A:This is a test sentence.\nSpeaker B:This is another sentence."
);

describe("WordRange", () => {
  describe("createWordRangeFromQuote", () => {
    it("Should create a WordRange from a quote", () => {
      const start = transcript.groups[0].words[1];
      const end = transcript.groups[0].words[3];
      const result = WordRange.createWordRangeFromQuote(
        transcript,
        "is a test"
      );

      expect(result?.startWord).toEqual(start);
      expect(result?.endWord).toEqual(end);
    });
    it("Should return null if the quote is not found", () => {
      const result = WordRange.createWordRangeFromQuote(
        transcript,
        "This is not a quote"
      );

      expect(result).toBeNull();
    });
    it("should create a wordrange from a quote in the second group", () => {
      const start = transcript.groups[1].words[1];
      const end = transcript.groups[1].words[2];
      const result = WordRange.createWordRangeFromQuote(
        transcript,
        "is another"
      );

      expect(result?.startWord).toEqual(start);
      expect(result?.endWord).toEqual(end);
    });
    it("should ignore differences in punctuation", () => {
      const start = transcript.groups[0].words[1];
      const end = transcript.groups[0].words[4];
      const result = WordRange.createWordRangeFromQuote(
        transcript,
        "is a test sentence"
      );

      expect(result?.startWord).toEqual(start);
      expect(result?.endWord).toEqual(end);
    });
    it("Should ignore speaker if passed in the quote", () => {
      const start = transcript.groups[0].words[1];
      const end = transcript.groups[0].words[3];
      const result = WordRange.createWordRangeFromQuote(
        transcript,
        "Speaker A: is a test"
      );

      expect(result?.startWord).toEqual(start);
      expect(result?.endWord).toEqual(end);
    });
  });
});
