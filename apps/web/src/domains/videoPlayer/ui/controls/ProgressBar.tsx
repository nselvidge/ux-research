import React, { ReactNode } from "react";

import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { usePlayerContext } from "../../state/playerContext";
import { SectionIcon } from "./SectionIcon";
import { useCurrentTime } from "../../state/currentTime";
import { useSections } from "../../state/sections";
import { useIsActive } from "~/domains/interview/state/currentWordState";

const Section = ({ section }: { section: { start: number; end: number } }) => {
  const isActive = useIsActive(section);

  return (
    <SliderMark value={section.start}>
      <SectionIcon isActive={isActive} />
    </SliderMark>
  );
};

const SliderContainer = ({ children }: { children: ReactNode }) => {
  const { duration, seekTo } = usePlayerContext();
  const [currentTime] = useCurrentTime();

  return (
    <Slider
      aria-label="playback-time"
      min={0}
      max={duration}
      key={duration}
      value={currentTime}
      onChange={seekTo}
      margin="0px 12px"
      focusThumbOnChange={false}
      flexGrow={1}
    >
      {children}
    </Slider>
  );
};

export const ProgressBar = () => {
  const { sections } = useSections();

  return (
    <SliderContainer>
      <SliderTrack>
        <SliderFilledTrack bgColor="brand.500" />
      </SliderTrack>
      <SliderThumb />
      {sections.map((section) => (
        <Section section={section} key={`section-${section.id}`} />
      ))}
    </SliderContainer>
  );
};
