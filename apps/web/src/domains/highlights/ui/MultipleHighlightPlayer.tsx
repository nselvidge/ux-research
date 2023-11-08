import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useKeyboardShortcut } from "~/domains/common/state/keyboardShortcuts";

import {
  HighlightPlayer,
  HighlightForPlayer,
  maxPlayerWidth,
} from "~/domains/highlights/ui/HighlightPlayer";
import { useActiveHighlightPlayer } from "../state/activeHighlightPlayer";

export const MultipleHighlightPlayer = ({
  highlights,
  currentTagName,
  playerGroup = "default",
}: {
  highlights: HighlightForPlayer[];
  currentTagName: string;
  playerGroup?: string;
}) => {
  const {
    isActive,
    index,
    setHighlightCount,
    closePlayer,
    nextVideo,
    previousVideo,
    playAll,
  } = useActiveHighlightPlayer(playerGroup);

  useEffect(() => {
    setHighlightCount(highlights.length);
  }, [highlights]);

  const [ref, setRef] = useState(null);
  const [width, setWidth] = useState(maxPlayerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    // set width to the width of the modal body
    setWidth(ref?.offsetWidth);
    //listen for window resize and update width
    const handleResize = () => {
      setWidth(ref?.offsetWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useKeyboardShortcut("right", () => {
    nextVideo();
  });

  useKeyboardShortcut("left", () => {
    previousVideo();
  });

  return (
    <Modal isOpen={isActive} onClose={closePlayer} size="full">
      <ModalOverlay />
      <ModalContent
        margin="0px 0px"
        background="none"
        boxShadow={"none"}
        overflow="hidden"
        onClick={() => closePlayer()}
      >
        <ModalCloseButton color="white"></ModalCloseButton>
        <ModalBody
          backgroundColor="none"
          display="flex"
          justifyContent={"center"}
        >
          <Box
            width="100%"
            maxWidth={`${maxPlayerWidth + 24}px`}
            flexShrink={0}
            flexGrow={0}
            ref={setRef}
          >
            <Flex
              width={`${(width + 24) * highlights.length}px`}
              marginLeft={`-${width * index}px`}
              alignItems={"center"}
              transition="margin-left 500ms"
              onClick={(e) => e.stopPropagation()}
            >
              {highlights.map((highlight, i) => (
                <HighlightPlayer
                  key={highlight.id}
                  currentTagName={currentTagName}
                  totalCount={highlights.length}
                  index={i}
                  highlight={highlight}
                  maxHeight={`${screenHeight - 40}px`}
                  isActive={index === i}
                  onEnded={() => {
                    if (playAll) {
                      nextVideo();
                    }
                  }}
                  playerGroup={playerGroup}
                />
              ))}
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
