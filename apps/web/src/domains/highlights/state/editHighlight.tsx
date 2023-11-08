import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

type NewHighlightWord = {
  id: string;
  groupNumber: number;
  wordNumber: number;
  start: number;
  end: number;
};

export type NewHighlightState = {
  isTopToBottom: boolean;
  highlightedRange: {
    startWord: NewHighlightWord;
    endWord: NewHighlightWord;
  };
};

const editHighlightState = atom<{
  currentHighlightId: string | null;
  isActivelyEditing: boolean;
  selectionId: number;
  promptHovered: boolean;
}>({
  key: "current-editing-highlight",
  default: {
    currentHighlightId: null,
    isActivelyEditing: false,
    selectionId: 0,
    promptHovered: false,
  },
});

export const useCurrentEditingHighlight = () => {
  const [{ currentHighlightId, isActivelyEditing, selectionId }, setState] =
    useRecoilState(editHighlightState);

  const setCurrentHighlight = useCallback(
    (id: string, setIsEditing = false) => {
      setState(
        ({
          isActivelyEditing,
          currentHighlightId,
          selectionId,
          promptHovered,
        }) => {
          return isActivelyEditing
            ? {
                currentHighlightId,
                isActivelyEditing,
                selectionId,
                promptHovered,
              }
            : {
                currentHighlightId: id,
                isActivelyEditing: setIsEditing || isActivelyEditing,
                selectionId: selectionId + 1,
                promptHovered: false,
              };
        }
      );
    },
    [setState]
  );

  const clearEditingHighlight = useCallback(() => {
    setState(({ selectionId }) => ({
      currentHighlightId: null,
      isActivelyEditing: false,
      selectionId: selectionId + 1,
      promptHovered: false,
    }));
  }, [setState]);

  const unsetCurrentHighlight = useCallback((stopId: number) => {
    setState(
      ({
        isActivelyEditing,
        currentHighlightId,
        selectionId,
        promptHovered,
      }) => {
        return isActivelyEditing || selectionId !== stopId || promptHovered
          ? {
              isActivelyEditing,
              currentHighlightId,
              selectionId,
              promptHovered,
            }
          : {
              currentHighlightId: null,
              isActivelyEditing,
              selectionId: selectionId + 1,
              promptHovered,
            };
      }
    );
  }, []);

  const startEditing = useCallback(() => {
    setState((state) => ({ ...state, isActivelyEditing: true }));
  }, [setState]);

  const stopEditing = useCallback(() => {
    setState(({ selectionId, promptHovered }) => ({
      isActivelyEditing: false,
      currentHighlightId: null,
      selectionId: selectionId + 1,
      promptHovered,
    }));
  }, [setState]);

  const onMouseEnterPrompt = useCallback(() => {
    setState((state) => ({
      ...state,
      promptHovered: true,
      selectionId: state.selectionId + 1,
    }));
  }, [setState]);

  const onMouseLeavePrompt = useCallback(() => {
    setState((state) =>
      state.isActivelyEditing
        ? { ...state, promptHovered: false }
        : {
            currentHighlightId: null,
            isActivelyEditing: false,
            selectionId: state.selectionId + 1,
            promptHovered: false,
          }
    );
  }, [setState]);

  return {
    currentHighlightId,
    selectionId,
    setCurrentHighlight,
    clearEditingHighlight,
    unsetCurrentHighlight,
    isActivelyEditing,
    startEditing,
    stopEditing,
    onMouseEnterPrompt,
    onMouseLeavePrompt,
  };
};
