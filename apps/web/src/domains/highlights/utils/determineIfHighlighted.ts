interface WordPointer {
  wordNumber: number;
  groupNumber: number;
}

const makeComparison = (word: WordPointer) =>
  word.groupNumber * 1000000 + word.wordNumber;

export const determineIfHighlighted = (
  startWord: WordPointer,
  word: WordPointer,
  endWord: WordPointer
) =>
  makeComparison(startWord) <= makeComparison(word) &&
  makeComparison(word) <= makeComparison(endWord);
