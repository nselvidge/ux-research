import React, { RefObject, useEffect, useRef, useState } from "react";
import { Text } from "@chakra-ui/react";

import { useIsTracking } from "~/domains/interview/state/isTrackingContext";
import { TranscriptGroupData } from "../../state/parsedTranscript";
import { useActiveWord } from "../../state/currentWordState";
import { getTextLocationByCharacterRange } from "../../utils/getTextByCharacters";

export const ActiveWord = ({
  groups,
  scrollContainerRef,
}: {
  groups: TranscriptGroupData[];
  scrollContainerRef: RefObject<HTMLDivElement>;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { isTracking } = useIsTracking();
  const activeWord = useActiveWord(groups);
  const [_, setLocation] = useState<null | {
    top: number;
    left: number;
  }>(null);

  const calcLocation = () => {
    const container = document.querySelector(
      `.groupContainer[data-group-number="${activeWord?.groupNumber}"]`
    ) as HTMLElement;

    if (!container || !ref?.current?.parentElement) {
      return;
    }

    const rect = getTextLocationByCharacterRange(
      container,
      activeWord.charStart,
      activeWord.charEnd
    );

    return {
      top:
        rect.top -
        ref.current.parentElement.getBoundingClientRect().top +
        ref.current.parentElement.scrollTop,
      left:
        rect.left -
        ref.current.parentElement.getBoundingClientRect().left +
        ref.current.parentElement.scrollLeft,
    };
  };

  useEffect(() => {
    const location = calcLocation();
    if (!location) {
      return;
    }
    // this ensures we update after the initial render
    setLocation(location);

    if (isTracking) {
      scrollContainerRef.current.scrollTo({
        top:
          location?.top -
          scrollContainerRef.current.clientHeight / 2 -
          ref.current.clientHeight,
        behavior: "smooth",
      });
    }
  }, [activeWord, isTracking]);

  const currentLocation = calcLocation();

  return (
    <Text
      ref={ref}
      userSelect="none"
      pointerEvents="none"
      as="span"
      whiteSpace="pre-line"
      position="absolute"
      zIndex={2}
      borderRadius="5px"
      color={"white"}
      padding={"2px 4px"}
      backgroundColor={"brand.500"}
      top={`${currentLocation?.top - 4}px`}
      left={`${currentLocation?.left - 4}px`}
      display={activeWord && currentLocation ? "block" : "none"}
    >
      {activeWord?.text + " "}
    </Text>
  );
};
