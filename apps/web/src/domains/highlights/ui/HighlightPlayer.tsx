import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Spacer, Text, Link } from "@chakra-ui/layout";
import { Button, IconButton, Img, useToast } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { FaEdit, FaLink } from "react-icons/fa";
import { trackEvent } from "~/domains/analytics/tracker";
import { PlayerContextProvider } from "~/domains/videoPlayer/state/playerContext";
import { VideoPlayer } from "~/domains/videoPlayer/ui/VideoPlayer";
import { useActiveHighlightPlayer } from "../state/activeHighlightPlayer";

export const maxPlayerWidth = 700;

export interface HighlightForPlayer {
  id: string;
  video?: {
    url?: string;
    previewImageUrl?: string;
  };
  interview: {
    id: string;
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
    }[];
  };
}

interface HighlightPlayerProps {
  highlight: HighlightForPlayer;
  isActive: boolean;
  index: number;
  totalCount: number;
  currentTagName: string;
  onEnded?: () => void;
  maxHeight?: string;
  playerGroup?: string;
}

const TranscriptGroup = ({
  group,
}: {
  group: HighlightForPlayer["transcript"]["groups"][0];
}) => {
  return (
    <Text variant="body" marginBottom="4px">
      {group.speaker.name}: {group.text}
    </Text>
  );
};

export const HighlightPlayer = ({
  highlight,
  isActive,
  index,
  totalCount,
  onEnded,
  currentTagName,
  maxHeight,
  playerGroup = "default",
}: HighlightPlayerProps) => {
  const { openPlayer, closePlayer } = useActiveHighlightPlayer(playerGroup);
  const toast = useToast();

  const [ref, setRef] = useState(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    //set height to the height of the text element
    setHeight(ref?.scrollHeight);
    //listen for window resize and update height
    const handleResize = () => {
      setHeight(ref?.scrollHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <PlayerContextProvider>
      <Flex
        padding="12px"
        direction="column"
        width="100%"
        maxWidth={`${maxPlayerWidth}px`}
        background="white"
        borderRadius="16px"
        margin="12px"
        maxHeight={maxHeight}
        overflowY="auto"
        onClick={() => openPlayer(index)}
      >
        <Flex flexShrink={0} paddingBottom="16px" alignItems="center">
          <Flex direction="column">
            <Text variant={"largeBodyBold"}>{highlight.interview.name}</Text>
            <Text variant="caption">
              {currentTagName} • {index + 1} of {totalCount}
            </Text>
          </Flex>
          <Spacer />
          <IconButton
            aria-label="edit highlight"
            icon={<FaEdit />}
            variant="brandMono"
            backgroundColor="white"
            as={Link}
            href={`/interview/${highlight.interview.id}#highlight-${highlight.id}`}
          />
          <Button
            aria-label="share highlight"
            variant="brandMono"
            backgroundColor="white"
            marginLeft="8px"
            leftIcon={<FaLink />}
            onClick={() => {
              window.navigator.clipboard.writeText(
                `${window.location.protocol}//${window.location.host}/highlight/${highlight.id}`
              );
              toast({
                title: "Link copied to clipboard",
                status: "success",
              });
              trackEvent("Share Button Clicked", {
                sharedEntityName: "Highlight",
                sharedEntityId: highlight.id,
              });
            }}
          >
            Share
          </Button>
          <Button
            variant="brandMono"
            marginLeft="8px"
            backgroundColor="white"
            onClick={(e) => {
              e.stopPropagation();
              closePlayer();
            }}
            leftIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Flex>
        <Flex
          width="100%"
          height="400px"
          alignItems="center"
          background="black"
          marginBottom="16px"
          flexShrink={0}
        >
          {isActive ? (
            <VideoPlayer
              previewImageUrl={highlight.video?.previewImageUrl}
              url={highlight.video?.url}
              autoplay
              onEnded={onEnded}
            />
          ) : (
            <Img width="100%" src={highlight.video?.previewImageUrl} />
          )}
        </Flex>
        <Flex
          overflow="hidden"
          maxHeight={isActive ? `${height + 11}px` : "0px"}
          transition="max-height 300ms"
          flexShrink={0}
        >
          <Flex
            width="100%"
            border="1px solid #E1E1E1"
            direction="column"
            padding="16px"
            borderRadius="16px"
            ref={setRef}
          >
            <Flex marginBottom="8px">
              <Text variant="caption">{highlight.interview.name}</Text>
              <Spacer />
              <Text variant="caption">
                {formatDistanceToNow(highlight.interview.date)} ago
              </Text>
            </Flex>
            <Box>
              {highlight.transcript?.groups?.map((group) => (
                <TranscriptGroup key={group.id} group={group} />
              ))}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </PlayerContextProvider>
  );
};
