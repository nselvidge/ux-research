import { Box, Flex } from "@chakra-ui/react";
import _, { throttle } from "lodash";
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { first, last, prop } from "remeda";
import { useIsTracking } from "~/domains/interview/state/isTrackingContext";
import { TranscriptGroupData } from "../../interview/state/parsedTranscript";
import { makeSearchWordByCoordinates } from "../../interview/utils/searchWordByCoordinates";
import {
  getHighlightedWordsRange,
  useHighlightedWords,
  useHighlightLines,
} from "../state/useHighlightLines";

import "./animations.less";

export interface HighlightType {
  id?: string;
  highlightedRange: {
    startWord: {
      id: string;
      wordNumber: number;
      groupNumber: number;
      start: number;
      end: number;
    };
    endWord: {
      id: string;
      wordNumber: number;
      groupNumber: number;
      start: number;
      end: number;
    };
  };
}

export const Draggable = ({
  isStart,
  background,
}: {
  isStart: boolean;
  background: string;
}) => (
  <Box
    borderLeft={`2px solid`}
    borderLeftColor={background}
    height="18px"
    display="inline-block"
    position="relative"
  >
    <Box
      width="8px"
      height="8px"
      borderRadius="8px"
      background={background}
      position="absolute"
      top={isStart ? "-8px" : "calc(100% - 2px)"}
      left="-5px"
    />
  </Box>
);

export const Highlight = <T extends HighlightType>({
  groups,
  highlight,
  background,
  disableEdits,
  updateHighlight,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  positionDeps = [],
  scrollIntoView,
}: {
  highlight: T;
  groups: TranscriptGroupData[];
  background: string;
  disableEdits?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
  positionDeps?: unknown[];
  scrollIntoView?: boolean;
  updateHighlight: (
    highlight: T,
    startWord: {
      id: string;
      wordNumber: number;
      groupNumber: number;
      start: number;
      end: number;
    },
    endWord: {
      id: string;
      wordNumber: number;
      groupNumber: number;
      start: number;
      end: number;
    }
  ) => Promise<unknown>;
}) => {
  const ref = useRef<HTMLDivElement>();
  const [textHovered, setTextHovered] = useState(false);
  const [draggableHovered, setDraggableHovered] = useState(false);
  const [draggingPosition, setDraggingPosition] = useState<
    null | "start" | "end"
  >(null);
  const [shouldFlash, setShouldFlash] = useState(false);

  const innerIsHovered =
    isHovered !== undefined ? isHovered : textHovered || draggableHovered;

  const isDragging = draggingPosition !== null;

  const allWords = useMemo(
    () => (groups ? groups.flatMap(prop("words")) : []),
    [groups]
  );

  const yOffset = 4;
  const xOffset = 8;

  useEffect(() => {
    if (draggingPosition === null) {
      return;
    }
    const search = makeSearchWordByCoordinates();
    const throttled = _.throttle(
      (e: MouseEvent) => {
        let startWord = highlight.highlightedRange.startWord;
        let endWord = highlight.highlightedRange.endWord;
        const word = search(
          allWords,
          e.clientX - (draggingPosition === "start" ? -xOffset : xOffset),
          e.clientY - (draggingPosition === "start" ? -yOffset : yOffset)
        );

        const currentDraggingPosition = draggingPosition;

        if (
          currentDraggingPosition === "start" &&
          word.end >= highlight.highlightedRange.endWord.end
        ) {
          setDraggingPosition("end");
          startWord = endWord;
          endWord = word;
        } else if (
          currentDraggingPosition === "end" &&
          word.start <= highlight.highlightedRange.startWord.start
        ) {
          setDraggingPosition("start");
          endWord = startWord;
          startWord = word;
        } else if (currentDraggingPosition === "start") {
          startWord = word;
        } else if (currentDraggingPosition === "end") {
          endWord = word;
        }

        updateHighlight(highlight, startWord, endWord);
      },
      50,
      { leading: true, trailing: true }
    );

    const handleMouseMove = (e: MouseEvent) => {
      if (draggingPosition === null) {
        return;
      }
      e.preventDefault();
      throttled(e);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [draggingPosition, highlight, allWords]);

  const handleDragStart = useCallback(
    (isStart: boolean): MouseEventHandler<HTMLDivElement> =>
      (e) => {
        e.stopPropagation();
        const handleMouseUp = () => {
          setDraggingPosition(null);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        setDraggingPosition(isStart ? "start" : "end");

        document.addEventListener("mouseup", handleMouseUp);
      },
    []
  );

  const highlightLines = useHighlightLines({ highlight, groups, ref }, [
    ...positionDeps,
  ]);
  const highlightedWords = useHighlightedWords({ highlight, groups });

  useEffect(() => {
    if (textHovered) {
      onMouseEnter?.();
    } else {
      onMouseLeave?.();
    }
  }, [textHovered]);

  useEffect(() => {
    const onMouseMove = throttle((e: MouseEvent) => {
      const range = getHighlightedWordsRange(highlightedWords);
      const rect = range.getBoundingClientRect();
      if (
        e.x > rect.x &&
        e.x < rect.x + rect.width &&
        e.y > rect.y &&
        e.y < rect.y + rect.height
      ) {
        if (!textHovered) {
          return setTextHovered(true);
        }
        return;
      } else if (textHovered) {
        return setTextHovered(false);
      }
    }, 10);

    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [highlightedWords, textHovered, onMouseEnter, onMouseLeave]);

  const firstLine = first(highlightLines);
  const lastLine = last(highlightLines);

  const firstLineRef = useRef<HTMLDivElement>();
  const { setIsTracking } = useIsTracking();

  useEffect(() => {
    if (scrollIntoView && firstLineRef.current) {
      setIsTracking(false);
      firstLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setShouldFlash(true);
      setTimeout(() => {
        setShouldFlash(false);
      }, 1000);
    } else if (
      window.location.hash === `#highlight-${highlight.id}` &&
      firstLineRef.current
    ) {
      firstLineRef.current.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
        block: "start",
      });
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
      setShouldFlash(true);
      setTimeout(() => {
        setShouldFlash(false);
      }, 1000);
    }
  }, [scrollIntoView, firstLineRef.current, window.location.href]);

  return (
    <Flex
      ref={ref}
      onMouseEnter={() => {
        setDraggableHovered(true);
      }}
      onMouseLeave={() => setDraggableHovered(false)}
    >
      {highlightLines.map((rect, i) => {
        return (
          <Box
            key={`bg-${rect.top}-${rect.left}`}
            userSelect="none"
            pointerEvents="none"
            position="absolute"
            zIndex={1}
            left={`${rect.left}px`}
            width={`${
              i === highlightLines.length - 1 ? rect.width + 2 : rect.width + 5
            }px`}
            top={`${rect.top - 3}px`}
            height={`${24}px`}
            background={background}
            transition={"opacity 300ms"}
            opacity={innerIsHovered ? 0.3 : 0.2}
            animation={
              shouldFlash ? `animate-opacity 500ms ${i * 8}ms` : undefined
            }
          >
            {i === 0 && (
              <Box
                width="0px"
                height="0px"
                margin="0px"
                padding="0px"
                border="0px"
                position="relative"
                top="-25px"
                id={i === 0 ? `highlight-${highlight.id}` : undefined}
                ref={i === 0 ? firstLineRef : undefined}
              />
            )}
          </Box>
        );
      })}
      {firstLine && !disableEdits && (
        <Box
          zIndex={4}
          position="absolute"
          top={`${firstLine.top}px`}
          left={`${firstLine.left - 2}px`}
          transition={"opacity 300ms"}
          opacity={innerIsHovered ? 1 : 0}
          cursor={isDragging ? "grabbing" : "grab"}
          onMouseDown={handleDragStart(true)}
        >
          <Draggable background={background} isStart />
        </Box>
      )}
      {lastLine && !disableEdits && (
        <Box
          zIndex={4}
          position="absolute"
          top={`${lastLine.top}px`}
          left={`${lastLine.left + lastLine.width + 1}px`}
          transition={"opacity 300ms"}
          opacity={innerIsHovered ? 1 : 0}
          cursor={isDragging ? "grabbing" : "grab"}
          onMouseDown={handleDragStart(false)}
        >
          <Draggable background={background} isStart={false} />
        </Box>
      )}
    </Flex>
  );
};
