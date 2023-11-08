import React, {
  createContext,
  ReactNode,
  Ref,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import { useLocalStorage } from "~/domains/common/state/useLocalStorage";
import { useIsTracking } from "~/domains/interview/state/isTrackingContext";
import { useCurrentTime } from "./currentTime";
import screenfull from "screenfull";

export const PROGRESS_INTERVAL = 50;

type PlayerContextValue = {
  ref: Ref<ReactPlayer>;
  seekTo: (newTime: number) => void;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  onProgress: (progress: {
    playedSeconds: number;
    loadedSeconds: number;
  }) => void;
  duration: number;
  onDuration: (newDuration: number) => void;
  fullscreen: () => void;
  canFullscreen: boolean;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const usePlayerContext = () => {
  const value = useContext(PlayerContext);
  if (value === null) {
    throw new Error(
      "Can only use PlayerContext when nested beneath a PlayerContextProvider"
    );
  }

  return value;
};

type Milliseconds = number;

export const PlayerContextProvider = ({
  children,
  autoPlay,
}: {
  children: ReactNode;
  autoPlay?: boolean;
}) => {
  const ref = useRef<ReactPlayer>(null);
  const { setIsTracking } = useIsTracking();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useLocalStorage("playbackSpeed", 1);
  const [duration, setDuration] = useState<Milliseconds | null>(null);
  const [, setCurrentTime] = useCurrentTime();

  const seekTo = useCallback(
    (milliseconds: Milliseconds) => {
      setIsTracking(true);
      setCurrentTime(milliseconds);
      if (!ref.current) {
        throw new Error("can only seekTo when a video player is present");
      }
      ref.current.seekTo(milliseconds / 1000);
    },
    [setIsTracking]
  );

  const value = useMemo(
    () => ({
      ref,
      isPlaying,
      playbackSpeed,
      duration,
      seekTo,
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      setPlaybackSpeed: (speed: number) => setPlaybackSpeed(speed),
      onProgress: ({
        playedSeconds,
      }: {
        playedSeconds: number;
        loadedSeconds: number;
      }) => {
        setCurrentTime(playedSeconds * 1000);
      },
      onDuration: (seconds: number) => setDuration(seconds * 1000),
      canFullscreen: screenfull.isEnabled,
      fullscreen: () => {
        screenfull.request(ref.current.getInternalPlayer() as Element);
      },
    }),
    [ref, isPlaying, duration, seekTo, playbackSpeed]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};
