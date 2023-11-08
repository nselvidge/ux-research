import { TranscriptWordWithHighlights } from "../state/parsedTranscript";
import { getTextLocationByCharacterRange } from "./getTextByCharacters";

const getGroupNode = (groupNumber: number) =>
  document.querySelector(`.groupContainer[data-group-number="${groupNumber}"]`);

export const makeSearchWordByCoordinates = () => {
  const search = (
    elems: TranscriptWordWithHighlights[],
    x: number,
    y: number
  ): TranscriptWordWithHighlights | undefined => {
    if (elems.length === 0) {
      return undefined;
    } else if (elems.length === 1) {
      return elems[0];
    }

    const middleIndex = Math.floor(elems.length / 2);
    const middle = elems[Math.floor(elems.length / 2)];

    const bounds = getTextLocationByCharacterRange(
      getGroupNode(middle.groupNumber),
      middle.charStart,
      middle.charEnd
    );

    if (bounds.top - 2 > y) {
      return search(elems.slice(0, middleIndex), x, y);
    } else if (bounds.bottom + 3 < y) {
      return search(elems.slice(middleIndex), x, y);
    } else if (bounds.left > x) {
      return search(elems.slice(0, middleIndex), x, y);
    } else if (bounds.right < x) {
      return search(elems.slice(middleIndex), x, y);
    }

    return middle;
  };

  return search;
};
