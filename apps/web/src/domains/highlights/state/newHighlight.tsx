import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { Tag } from "~/domains/tags/ui/TagSelect";

type NewHighlightWord = {
  id: string;
  groupNumber: number;
  wordNumber: number;
  start: number;
  end: number;
};

export type NewHighlightState = {
  isTopToBottom: boolean;
  tags: Tag[];
  highlightedRange: {
    text: string;
    startWord: NewHighlightWord;
    endWord: NewHighlightWord;
  };
};

const newHighlightState = atom<NewHighlightState | null>({
  key: "new-highlight",
  default: null,
});

export const useNewHighlight = () => {
  const [newHighlight, setNewHighlight] = useRecoilState(newHighlightState);

  const updateNewHighlight = useCallback(
    (
      highlight: NewHighlightState,
      startWord: NewHighlightWord,
      endWord: NewHighlightWord
    ) => {
      let isTopToBottom = highlight.isTopToBottom;
      if (highlight.highlightedRange.startWord.start !== startWord.start) {
        isTopToBottom = false;
      } else if (highlight.highlightedRange.endWord.start !== endWord.start) {
        isTopToBottom = true;
      } else {
        return;
      }

      setNewHighlight({
        ...highlight,
        isTopToBottom,
        highlightedRange: {
          ...highlight.highlightedRange,
          startWord,
          endWord,
        },
      });
    },
    [newHighlight]
  );

  const initNewHighlight = useCallback(
    (
      startWord: NewHighlightWord,
      endWord: NewHighlightWord,
      isTopToBottom: boolean
    ) => {
      setNewHighlight({
        highlightedRange: { startWord, endWord, text: "" },
        isTopToBottom,
        tags: [],
      });
    },
    []
  );

  const clearNewHighlight = useCallback(() => {
    setNewHighlight(null);
  }, []);

  const setTags = useCallback(
    (tags: Tag[]) => {
      setNewHighlight((highlight) => ({ ...highlight, tags }));
    },
    [setNewHighlight]
  );

  return {
    newHighlight,
    updateNewHighlight,
    clearNewHighlight,
    initNewHighlight,
    setTags,
  };
};
