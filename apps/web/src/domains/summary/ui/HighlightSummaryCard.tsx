import { Box, Flex, Text } from "@chakra-ui/layout";
import { Img } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { ShareButton } from "~/domains/common/ui/ShareButton";

export interface HighlightSummaryData {
  id: string;
  video?: {
    id: string;
    url?: string;
    previewImageUrl?: string;
    previewGifUrl?: string;
  };
  interview: {
    name: string;
    date: number;
  };
  transcript?: {
    id?: string;
    groups?: {
      id: string;
      text: string;
      speaker: {
        id: string;
        name: string;
      };
      words: {
        id: string;
        text: string;
        start: number;
        end: number;
      }[];
    }[];
  };
}

export interface HighlightSummaryCardProps {
  highlight: HighlightSummaryData;
  onClick?: () => void;
}

export const HighlightSummaryCard = ({
  highlight,
  onClick,
}: HighlightSummaryCardProps) => {
  const { video, transcript } = highlight;
  const [isHovering, setIsHovering] = useState(false);

  const transcriptText = useMemo(
    () =>
      transcript?.groups?.reduce(
        (acc, group) => acc + group.speaker.name + ": " + group.text + "\n",
        ""
      ),
    []
  );

  return (
    <Flex
      background="white"
      width="368px"
      border="1px solid #E1E1E1"
      borderRadius="16px"
      marginBottom="16px"
      overflow="hidden"
      alignItems="start"
      direction="column"
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box width="100%" flexGrow={0} flexShrink={0} position="relative">
        {video && video.previewImageUrl ? (
          <Flex
            width="100%"
            height={"205px"}
            backgroundColor="gray.300"
            alignItems="center"
            justifyContent="center"
          >
            <Img
              width="100%"
              src={
                isHovering
                  ? `${video?.previewGifUrl}`
                  : `${video?.previewImageUrl}`
              }
              flexGrow={0}
              borderRadius="16px"
            />
          </Flex>
        ) : (
          <Box
            background="gray.300"
            width="100%"
            height="205px"
            borderRadius="16px"
          />
        )}
        <Flex
          position="absolute"
          background="rgba(0,0,0,0.2)"
          width="100%"
          height="100%"
          borderRadius="16px"
          top={0}
          left={0}
          alignItems="center"
          justifyContent="center"
        >
          <FaPlay
            color="white"
            style={{ opacity: isHovering ? "1" : "0.8" }}
            size="24px"
          />
        </Flex>
      </Box>
      <Flex padding="16px" direction="column" alignItems="start">
        <Text variant="body" marginBottom="4px" noOfLines={3}>
          {transcriptText}
        </Text>

        <ShareButton
          variant="link"
          shareLink={`${window.location.origin}/highlight/${highlight.id}`}
          padding="4px 0px 0px"
          withIcon
          sharedEntityId={highlight.id}
          sharedEntityName="highlight"
        >
          Share Highlight
        </ShareButton>
      </Flex>
    </Flex>
  );
};
