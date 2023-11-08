import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import {
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeOff,
  FaVolumeMute,
} from "react-icons/fa";
import { useVolume } from "../../state/useVolume";

export const Volume = () => {
  const { isMute, volume, toggleMute, setVolume } = useVolume();
  const [isHover, setIsHover] = useState(false);

  return (
    <Flex
      alignItems="center"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <IconButton
        onClick={toggleMute}
        icon={
          isMute ? (
            <FaVolumeMute />
          ) : volume === 0 ? (
            <FaVolumeOff />
          ) : volume > 0.5 ? (
            <FaVolumeUp />
          ) : (
            <FaVolumeDown />
          )
        }
        aria-label={isMute ? "mute" : "unmute"}
        color="#EAEAEA"
        variant="link"
        padding="6px"
        flexShrink={0}
        minWidth="16px"
      />
      <Flex
        justifyContent="start"
        width={isHover ? "70px" : "0px"}
        overflow="hidden"
        transition={isHover ? "width 300ms" : "width 300ms 1s"}
        marginLeft="-5px"
      >
        <Box width="70px" padding="10px" flexShrink={0}>
          <Slider
            onChange={(volume: number) => {
              if (isMute && volume !== 0) {
                toggleMute();
              }
              setVolume(volume);
            }}
            min={0}
            max={1}
            step={0.01}
            value={isMute ? 0 : volume}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={2} />
          </Slider>
        </Box>
      </Flex>
    </Flex>
  );
};
