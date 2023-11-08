import { deserializeHighlightPendingTranscript } from "../../interactors/serializers/SerializedHighlight";
import { createPendingHighlight } from "../../interactors/__tests__/utils/createInterview";
import { createTranscript } from "../../interactors/__tests__/utils/createTranscript";
import { updateHighlightWithTranscript } from "../Highlight";
import { Transcript } from "../Transcript";

describe("HighlightPendingTranscript", () => {
  describe("#handleTranscript", () => {
    it("should return the first sentence if the timestamp is before the transcript starts", () => {
      const highlight = deserializeHighlightPendingTranscript(
        createPendingHighlight({ timestamp: 100 })
      );
      const transcript = Transcript.create(
        createTranscript({ groups: 5, wordsPerGroup: 5 })
      );

      const newHighlight = updateHighlightWithTranscript(
        highlight, 
        transcript,
        new Date(100000)
      );

      expect(newHighlight.highlightedRange.startWord.wordNumber).toBe(0);
      expect(newHighlight.highlightedRange.endWord.wordNumber).toBe(4);
    });
    it("should return the last sentence if the timestamp is after the transcript starts", () => {
      const highlight = deserializeHighlightPendingTranscript(
        createPendingHighlight({ timestamp: 1000000000 })
      );
      const transcript = Transcript.create(
        createTranscript({ groups: 5, wordsPerGroup: 5 })
      );

      const newHighlight = updateHighlightWithTranscript(
        highlight,
        transcript,
        new Date(100)
      );

      expect(newHighlight.highlightedRange.startWord.wordNumber).toBe(0);
      expect(newHighlight.highlightedRange.endWord.wordNumber).toBe(4);
    });
    it("should highlight the start of the sentence 15 seconds before, and the end of the sentence 15 seconds after", () => {
      const highlight = deserializeHighlightPendingTranscript(
        // timestamp 20 + 16 seconds into the recording, should be 15 seconds into second group
        createPendingHighlight({ timestamp: 1000 * 36 })
      );

      const transcript = Transcript.create(
        // 10 * 100 * 200 = 200,000 ms total, 20 seconds per group
        createTranscript({ groups: 10, wordsPerGroup: 100 })
      );

      const newHighlight = updateHighlightWithTranscript(highlight, transcript, new Date(0));

      expect(newHighlight.highlightedRange.startWord.wordNumber).toBe(0);
      expect(newHighlight.highlightedRange.startWord.groupNumber).toBe(1);

      expect(newHighlight.highlightedRange.endWord.wordNumber).toBe(99);
      expect(newHighlight.highlightedRange.endWord.groupNumber).toBe(2);
    });
  });
});
