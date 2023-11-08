import { throttle } from "lodash";
import React, { RefObject, useCallback, useEffect } from "react";
import { useInterviewQuery } from "../../requests/interviews.generated";
import { TranscriptGroupData } from "../../state/parsedTranscript";
import { valueIsBetweenBounds } from "../../utils/valueIsBetweenBounds";
import { useNewHighlight } from "../../../highlights/state/newHighlight";
import { Highlight } from "../../../highlights/ui/Highlight";
import { first } from "remeda";
import { useCurrentEditingHighlight } from "~/domains/highlights/state/editHighlight";
import { useKeyboardShortcut } from "~/domains/common/state/keyboardShortcuts";

interface SelectionPromptProps {
  selectionContainerRef: RefObject<HTMLDivElement | null>;
  interviewId: string;
  groups: TranscriptGroupData[];
}

const getElementFromNode = (node: Node): HTMLSpanElement =>
  (node.nodeType === 1
    ? (node as HTMLSpanElement)
    : node.parentElement
  ).closest("[data-group-number]");

const getWordFromOffset = (group: TranscriptGroupData, offset: number) =>
  group.words.find(({ charStart, charEnd }) =>
    valueIsBetweenBounds(offset, charStart, charEnd)
  );

const getSelectionIsTopToBottom = () => {
  const selection = window.getSelection();
  if (selection.toString() !== "") {
    const startRange = document.createRange();
    startRange.setStart(selection.anchorNode, selection.anchorOffset);
    startRange.setEnd(selection.anchorNode, selection.anchorOffset);

    return (
      startRange.comparePoint(selection.focusNode, selection.focusOffset) >= 0
    );
  }
  return null;
};

export const SelectionPrompt = ({
  selectionContainerRef,
  interviewId,
  groups,
}: SelectionPromptProps) => {
  const { data } = useInterviewQuery({
    variables: { id: interviewId },
  });
  const { isActivelyEditing, clearEditingHighlight } =
    useCurrentEditingHighlight();
  const {
    newHighlight,
    initNewHighlight,
    updateNewHighlight,
    clearNewHighlight,
  } = useNewHighlight();

  const openCreateHighlightPrompt = useCallback(async () => {
    clearEditingHighlight();

    const selection = window.getSelection();
    if (selection.toString() === "") {
      throw new Error("cannot create a highlight when no text is selected");
    }

    const range = selection.getRangeAt(0);
    const firstChild = selectionContainerRef.current.firstChild;
    const lastChild = selectionContainerRef.current.lastChild;
    if (range.comparePoint(firstChild, 0) >= 0) {
      range.setStartBefore(firstChild);
    }

    if (range.comparePoint(lastChild, 0) <= 0) {
      range.setEndAfter(lastChild);
    }

    const startGroup = parseInt(
      getElementFromNode(range.startContainer).dataset.groupNumber || "0",
      10
    );

    const endGroup = parseInt(
      getElementFromNode(range.endContainer).dataset.groupNumber ||
        range.endContainer.textContent.length + "",
      10
    );

    const startWord = getWordFromOffset(groups[startGroup], range.startOffset);
    const endWord = getWordFromOffset(groups[endGroup], range.endOffset);
    const isTopToBottom = getSelectionIsTopToBottom();

    initNewHighlight(startWord, endWord, isTopToBottom);
    window.setTimeout(() => selection.removeAllRanges(), 1);
  }, [groups, isActivelyEditing]);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      openCreateHighlightPrompt();
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onSelectionChange = () => {
      const selection = window.getSelection();
      document.removeEventListener("mouseup", onMouseUp);

      if (
        selection.containsNode(selectionContainerRef.current, true) &&
        selection.getRangeAt(0).toString() !== "" &&
        data?.interview?.currentUserCanEdit
      ) {
        clearNewHighlight();

        document.addEventListener("mouseup", onMouseUp);
      }
    };

    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [
    data?.interview?.currentUserCanEdit,
    openCreateHighlightPrompt,
    clearNewHighlight,
  ]);

  useEffect(() => { 
    const onClick = () => {
      if (newHighlight) {
        clearNewHighlight();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, [newHighlight, clearNewHighlight]);

  
  useKeyboardShortcut("cmd+c, ctrl+c", () => {
    if (!newHighlight || isActivelyEditing) {
        return;
    }

    // copy higlighted text to clipboard
    const highlightedText = groups.reduce((acc, group) => {
      const { highlightedRange } = newHighlight;
      if (
        group.groupNumber >= highlightedRange.startWord.groupNumber &&
        group.groupNumber <= highlightedRange.endWord.groupNumber
      ) {
        return (
          acc +
          `${group.speaker.name}: ${group.words
            .filter(
              (word) =>
                word.start >= highlightedRange.startWord.start &&
                word.end <= highlightedRange.endWord.end
            )
            .map((word) => word.text)
            .join(" ")}\n\n`
        );
      }
      return acc;
    }, "");

    navigator.clipboard.writeText(highlightedText);
  });

  return (
    <>
      {newHighlight && !isActivelyEditing && (
        <Highlight
          highlight={newHighlight}
          background={
            newHighlight.tags.length > 0
              ? `${first(newHighlight.tags).color}.500`
              : "#A1A1A1"
          }
          groups={groups}
          updateHighlight={throttle(updateNewHighlight, 100)}
        />
      )}
    </>
  );
};
