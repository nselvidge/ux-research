import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { Box } from "@chakra-ui/react";
import { PROGRESS_INTERVAL, usePlayerContext } from "../state/playerContext";
import { ControlBar } from "./ControlBar";
import { useVolume } from "../state/useVolume";

type VideoPlayerProps = {
  url: string;
  previewImageUrl: string;
  autoplay?: boolean;
  onEnded?: () => void;
};

export const VideoPlayer = ({ url, autoplay, onEnded }: VideoPlayerProps) => {
  const { ref, isPlaying, onDuration, onProgress, pause, play, playbackSpeed } =
    usePlayerContext();

  const { isMute, volume } = useVolume();

  useEffect(() => {
    if (autoplay) {
      play();
    }
  }, [autoplay]);

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="10px"
      width="100%"
      height="100%"
    >
      <Box
        onClick={() => (isPlaying ? pause() : play())}
        width="100%"
        height="100%"
      >
        <ReactPlayer
          playing={isPlaying}
          onDuration={onDuration}
          onProgress={onProgress}
          playbackRate={playbackSpeed}
          onPause={pause}
          onPlay={play}
          volume={volume}
          muted={isMute}
          width="100%"
          height="100%"
          ref={ref}
          url={url}
          progressInterval={PROGRESS_INTERVAL}
          onEnded={onEnded}
        />
      </Box>
      <ControlBar />
    </Box>
  );
};
