import { Flex } from "@chakra-ui/react";
import React from "react";
import { PlayButton } from "./controls/PlayButton";
import { ProgressBar } from "./controls/ProgressBar";
import { TimeProgress } from "./controls/TimeProgress";
import { PlaybackSpeed } from "./controls/PlaybackSpeed";
import { Volume } from "./controls/Volume";
import { FullScreen } from "./controls/FullScreen";

export const ControlBar = () => (
  <Flex
    direction="column"
    width="100%"
    position="absolute"
    bottom="0px"
    left="0px"
    backgroundColor="rgba(0,0,0,0.3)"
  >
    <Flex alignItems="center" padding="6px" justifyContent="left">
      <PlayButton />
      <Volume />
      <TimeProgress />
      <ProgressBar />
      <PlaybackSpeed />
      <FullScreen />
    </Flex>
  </Flex>
);
