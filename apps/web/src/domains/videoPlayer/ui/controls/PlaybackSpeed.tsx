import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { MenuOptions } from "~/domains/common/ui/MenuOptions";
import { usePlayerContext } from "../../state/playerContext";

const options = [
  { label: "1x", value: 1 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 },
  { label: "1.75x", value: 1.75 },
  { label: "2x", value: 2 },
];

export const PlaybackSpeed = () => {
  const { playbackSpeed, setPlaybackSpeed } = usePlayerContext();
  return (
    <Box padding="0px 6px">
      <MenuOptions
        options={options}
        value={playbackSpeed}
        onChange={setPlaybackSpeed}
        variant="white"
        menuTitle="Playback speed"
      />
    </Box>
  );
};
