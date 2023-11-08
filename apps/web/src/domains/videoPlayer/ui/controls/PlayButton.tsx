import React from "react";
import { IconButton } from "@chakra-ui/react";
import { usePlayerContext } from "../../state/playerContext";
import { FaPause, FaPlay } from "react-icons/fa";

export const PlayButton = () => {
  const { isPlaying, play, pause } = usePlayerContext();

  return (
    <IconButton
      onClick={isPlaying ? pause : play}
      icon={isPlaying ? <FaPause /> : <FaPlay />}
      aria-label={isPlaying ? "pause" : "play"}
      color="#EAEAEA"
      variant="link"
      padding="6px"
      flexShrink={0}
      minWidth="16px"
    />
  );
};
