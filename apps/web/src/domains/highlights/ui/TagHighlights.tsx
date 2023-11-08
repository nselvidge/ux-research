import { Box, Flex, Grid, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Button, useToast } from "@chakra-ui/react";
import { Emoji } from "emoji-picker-react";
import React from "react";
import { FaLink, FaPlay } from "react-icons/fa";
import { trackEvent } from "~/domains/analytics/tracker";
import { useActiveHighlightPlayer } from "../state/activeHighlightPlayer";
import { HighlightCard } from "./HighlightCard";
import { MultipleHighlightPlayer } from "./MultipleHighlightPlayer";

interface HighlightDetails {
  id: string;
  interview: {
    name: string;
    id: string;
    date: number;
  };
  video?: {
    previewImageUrl?: string;
    previewGifUrl?: string;
    id: string;
  };
  transcript?: {
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

export const TagHighlights = ({
  highlights,
  currentTag,
}: {
  highlights: HighlightDetails[];
  currentTag: {
    id: string;
    name: string;
    color: string;
    emoji: string;
  };
}) => {
  const toast = useToast();
  const { openPlayer, startPlayAll } = useActiveHighlightPlayer("default");

  return (
    <Box width="100%">
      <Flex alignItems="center" marginBottom="32px">
        <Flex
          width="72px"
          height="72px"
          backgroundColor={`${currentTag.color}.100`}
          borderRadius="16px"
          marginRight="16px"
          alignItems="center"
          justifyContent="center"
        >
          <Emoji unified={currentTag.emoji} />
        </Flex>
        <Flex direction="column">
          <Heading variant="titleBold">{currentTag.name}</Heading>
          <Text variant="body">{highlights.length} highlights</Text>
        </Flex>
        <Spacer />
        <Button
          variant="brandMono"
          onClick={() => {
            window.navigator.clipboard.writeText(
              `${window.location.protocol}//${window.location.hostname}/tag/${currentTag.id}`
            );

            toast({
              title: "Link copied to clipboard",
              status: "success",
            });
            trackEvent("Share Button Clicked", {
              sharedEntityName: "Tag",
              sharedEntityId: currentTag.id,
            });
          }}
          leftIcon={<FaLink />}
        >
          Share
        </Button>
        <Button
          variant="brand"
          onClick={() => startPlayAll()}
          leftIcon={<FaPlay />}
          marginLeft="16px"
        >
          Play all
        </Button>
      </Flex>
      <Text marginBottom="16px" variant="body">
        Sorted by: Newest to oldest
      </Text>
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)",
        }}
        gridGap="16px 16px"
        alignItems="stretch"
      >
        {highlights.map((highlight, index) => (
          <HighlightCard
            key={highlight.id}
            onClick={() => openPlayer(index)}
            interviewDate={highlight.interview.date}
            coverImageUrl={highlight.video?.previewImageUrl}
            coverGifUrl={highlight.video?.previewGifUrl}
            transcript={highlight.transcript}
          />
        ))}
      </Grid>
      {highlights && (
        <MultipleHighlightPlayer
          currentTagName={currentTag?.name}
          highlights={highlights}
        />
      )}
    </Box>
  );
};
