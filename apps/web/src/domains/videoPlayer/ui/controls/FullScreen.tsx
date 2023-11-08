import { IconButton } from "@chakra-ui/react";
import React from "react";
import { FaExpand } from "react-icons/fa";
import { usePlayerContext } from "../../state/playerContext";

export const FullScreen = () => {
  const { fullscreen, canFullscreen } = usePlayerContext();
  return (
    canFullscreen && (
      <IconButton
        aria-label="expand video"
        onClick={fullscreen}
        variant="link"
        color="#EAEAEA"
        icon={<FaExpand />}
      />
    )
  );
};
