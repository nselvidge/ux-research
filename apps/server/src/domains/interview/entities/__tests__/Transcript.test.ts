import { range } from "remeda";
import { createTranscriptGroup } from "../../interactors/__tests__/utils/createTranscript";
import { Transcript } from "../Transcript";

describe("Transcript", () => {
  describe("#create", () => {
    it("should error if the transcript contains groups that are out of order", () => {
      const id = "abc";
      const groups = range(0, 3).map((i) =>
        createTranscriptGroup({ groupNumber: 3 - i })
      );

      expect(() => Transcript.create({ id, groups })).toThrow();
    });
  });

  describe("#getSentenceStartBeforeTimestamp", () => {
    it("should return the 6th word when given the timestamp of the 8th word if the 5th word has a period", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end.";
      const transcript = Transcript.create({ id, groups });
      const word = transcript.getSentenceStartBeforeTimestamp(200 * 7);
      expect(word?.wordNumber).toBe(5);
    });

    it("should return the 1st word in the group if there is no punctuation before the given timestamp", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceStartBeforeTimestamp(200 * 7);
      expect(word?.wordNumber).toBe(0);
    });

    it("should return the timestamp word if the previous word has a punctuation mark", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end.";

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceStartBeforeTimestamp(200 * 5);
      expect(word?.wordNumber).toBe(5);
    });

    it("should not return the timestamp word if it has a punctuation mark", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end.";

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceStartBeforeTimestamp(200 * 4);
      expect(word?.wordNumber).toBe(0);
    });

    it("should work with a question mark", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end?";

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceStartBeforeTimestamp(200 * 5);
      expect(word?.wordNumber).toBe(5);
    });

    it("should work with an exclamation mark", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end!";

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceStartBeforeTimestamp(200 * 5);
      expect(word?.wordNumber).toBe(5);
    });
  });
  describe("#getSentenceEndAfterTimestamp", () => {
    it("should return the 5th word when given the timestamp of the 3rd word if the 5th word has a period", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end.";
      const transcript = Transcript.create({ id, groups });
      const word = transcript.getSentenceEndAfterTimestamp(200 * 3);
      expect(word?.wordNumber).toBe(4);
    });

    it("should return the last word in the group if there is no punctuation after the given timestamp", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceEndAfterTimestamp(200 * 3);
      expect(word?.wordNumber).toBe(9);
    });

    it("should return the timestamp word if it has a punctuation mark", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end.";

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceEndAfterTimestamp(200 * 4);
      expect(word?.wordNumber).toBe(4);
    });

    it("should work with a question mark", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end?";

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceEndAfterTimestamp(200 * 3);
      expect(word?.wordNumber).toBe(4);
    });

    it("should work with an exclamation mark", () => {
      const id = "abc";
      const groups = [createTranscriptGroup({ groupNumber: 0, words: 10 })];
      groups[0].words[4].text = "end!";

      const transcript = Transcript.create({ id, groups });

      const word = transcript.getSentenceEndAfterTimestamp(200 * 3);
      expect(word?.wordNumber).toBe(4);
    });
  });
});
