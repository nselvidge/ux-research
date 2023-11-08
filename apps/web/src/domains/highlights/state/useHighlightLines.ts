import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import {
  filter,
  first,
  flatMap,
  groupBy,
  isNil,
  isNot,
  last,
  map,
  mapValues,
  pipe,
  prop,
  range,
  sortBy,
} from "remeda";
import {
  TranscriptGroupData,
  TranscriptWordWithHighlights,
} from "~/domains/interview/state/parsedTranscript";
import { getTextLocationByCharacterRange } from "~/domains/interview/utils/getTextByCharacters";
import { HighlightType } from "../ui/Highlight";
import { determineIfHighlighted } from "../utils/determineIfHighlighted";
import { getGroupNode } from "../utils/getGroupNode";

export const useHighlightedWords = ({
  highlight,
  groups,
}: {
  highlight?: HighlightType;
  groups?: TranscriptGroupData[];
}) => {
  return useMemo(() => {
    if (!highlight || !groups) {
      return [];
    }
    return pipe(
      range(
        highlight.highlightedRange.startWord.groupNumber,
        highlight.highlightedRange.endWord.groupNumber + 1
      ),
      map((index) => groups?.[index]),
      filter(isNot(isNil)),
      flatMap(prop("words")),
      filter((word) =>
        determineIfHighlighted(
          highlight.highlightedRange.startWord,
          word,
          highlight.highlightedRange.endWord
        )
      )
    );
  }, [highlight, groups]);
};

export const getHighlightedWordsRange = (
  highlightedWords: TranscriptWordWithHighlights[]
) => {
  if (!highlightedWords.length) {
    return null;
  }
  const firstWord = first(highlightedWords);
  const lastWord = last(highlightedWords);
  const range = document.createRange();
  range.setStart(
    getGroupNode(firstWord.groupNumber).firstChild as HTMLElement,
    firstWord.charStart
  );
  range.setEnd(
    getGroupNode(lastWord.groupNumber).firstChild as HTMLElement,
    lastWord.charEnd - 1
  );
  return range;
};

export const useAllLinesRect = ({
  highlight,
  groups,
}: {
  highlight?: HighlightType;
  groups?: TranscriptGroupData[];
}) => {
  const highlightedWords = useHighlightedWords({ highlight, groups });

  return useCallback(() => {
    if (!highlightedWords.length) {
      return null;
    }
    const range = getHighlightedWordsRange(highlightedWords);

    return range.getBoundingClientRect();
  }, [highlightedWords]);
};

export const useHighlightLines = (
  {
    highlight,
    groups,
    ref,
  }: {
    highlight: HighlightType;
    groups?: TranscriptGroupData[];
    ref: RefObject<HTMLDivElement>;
  },
  deps: any[] = []
) => {
  const [highlightLines, setHighlightLines] = useState<DOMRect[]>([]);
  const highlightedWords = useHighlightedWords({ highlight, groups });

  useEffect(() => {
    const updateLines = () => {
      if (!ref.current) {
        return;
      }
      const lines = pipe(
        highlightedWords,
        map.indexed((word, i) => {
          return getTextLocationByCharacterRange(
            getGroupNode(word.groupNumber) as HTMLElement,
            word.charStart,
            i === highlightedWords.length - 1 ? word.charEnd - 1 : word.charEnd
          );
        }),
        groupBy((rect) => rect.bottom),
        mapValues((line) => {
          const firstNode = first(line);
          const lastNode = last(line);

          return DOMRect.fromRect({
            y:
              firstNode.top -
              ref.current.parentElement.getBoundingClientRect().top +
              ref.current.parentElement.scrollTop,
            x:
              firstNode.left -
              ref.current.parentElement.getBoundingClientRect().left +
              ref.current.parentElement.scrollLeft,
            width: lastNode.right - firstNode.left,
            height: firstNode.height,
          });
        }),
        (obj) => Object.values(obj),
        sortBy((rect) => rect.top)
      );
      setHighlightLines(lines);
    };
    updateLines();

    addEventListener("resize", updateLines);

    return () => removeEventListener("resize", updateLines);
  }, [highlightedWords, ...deps]);

  return highlightLines;
};
