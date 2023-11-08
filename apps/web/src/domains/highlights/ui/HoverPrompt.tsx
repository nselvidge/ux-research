import { Box } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { TranscriptGroupData } from "~/domains/interview/state/parsedTranscript";
import { useCurrentEditingHighlight } from "../state/editHighlight";
import { useAllLinesRect } from "../state/useHighlightLines";
import { usePopper } from "react-popper";
import { EditHighlightPrompt, Highlight } from "./EditHighlightPrompt";
import { HighlightDetailPrompt } from "./HighlightDetailPrompt";
import { useNewHighlight } from "../state/newHighlight";

export const HoverPrompt = ({
  interviewId,
  groups,
  currentHighlight,
  children,
}: {
  interviewId: string;
  groups: TranscriptGroupData[];
  currentHighlight?: Highlight | null;
  children: React.ReactNode;
}) => {
  const [popoverRef, setPopoverRef] = useState<HTMLDivElement | null>(null);
  const {
    isActivelyEditing,
    onMouseEnterPrompt,
    onMouseLeavePrompt,
    clearEditingHighlight,
  } = useCurrentEditingHighlight();

  const { newHighlight } = useNewHighlight();

  const getAllLinesRect = useAllLinesRect({
    highlight: currentHighlight || newHighlight,
    groups,
  });

  const virtualElement = useMemo(
    () =>
      getAllLinesRect
        ? {
            getBoundingClientRect: () => {
              const result = getAllLinesRect();
              // eslint-disable-next-line
              return result === null ? ({} as any) : result;
            },
          }
        : // eslint-disable-next-line
          { getBoundingClientRect: () => ({} as any) },
    [getAllLinesRect]
  );

  const { styles, attributes } = usePopper(virtualElement, popoverRef, {
    placement: "left",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "preventOverflow",
        options: {
          tether: false,
        },
      },
    ],
  });

  useEffect(() => {
    const onClick = () => {
      if (isActivelyEditing) {
        clearEditingHighlight();
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [isActivelyEditing, clearEditingHighlight]);

  return (
    <Box
      style={styles.popper}
      {...attributes.popper}
      display={currentHighlight || newHighlight ? "block" : "none"}
      minWidth="250px"
      maxWidth="350px"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
      zIndex={3}
      background="#fff"
      ref={setPopoverRef}
      borderRadius={isActivelyEditing ? "12px" : "16px"}
      onMouseEnter={onMouseEnterPrompt}
      onMouseLeave={onMouseLeavePrompt}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </Box>
  );
};
