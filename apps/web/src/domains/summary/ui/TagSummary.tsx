import { Flex, Heading, Spacer } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import { ShareButton } from "~/domains/common/ui/ShareButton";
import { useActiveHighlightPlayer } from "~/domains/highlights/state/activeHighlightPlayer";
import { MultipleHighlightPlayer } from "~/domains/highlights/ui/MultipleHighlightPlayer";
import {
  HighlightSummaryCard,
  HighlightSummaryData,
} from "./HighlightSummaryCard";

export interface TagSummaryProps {
  tag: {
    id: string;
    name: string;
  };
  highlights: HighlightSummaryData[];
}

const getHighlightStart = (highlight: HighlightSummaryData) => {
  const first = highlight.transcript?.groups?.[0]?.words?.[0];

  return first?.start || 0;
};

export const convertNameToId = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
};

export const TagSummary = ({ tag, highlights }: TagSummaryProps) => {
  const { openPlayer, startPlayAll } = useActiveHighlightPlayer(tag.id);
  const ref = useRef<HTMLHeadingElement>();
  useEffect(() => {
    if (window.location.hash === `#${convertNameToId(tag.name)}`) {
      ref.current.scrollIntoView();
    }
    return () => {
      window.location.hash = "";
    };
  }, [tag.name]);

  const sortedHighlights = useMemo(
    () =>
      highlights.sort((a, b) => getHighlightStart(a) - getHighlightStart(b)),
    [highlights]
  );

  return (
    <Flex marginTop="32px" marginBottom="16px" direction="column">
      <Flex>
        <Heading
          id={convertNameToId(tag.name)}
          ref={ref}
          variant="largeTitleBold"
          marginBottom="16px"
          // makes the scrolling stop with some padding above the heading
          paddingTop="25px"
          marginTop="-25px"
        >
          {tag.name}
        </Heading>
        <Spacer />
        <Button
          variant="brand"
          leftIcon={<FaPlay />}
          onClick={() => startPlayAll()}
          marginRight="4px"
        >
          Play All
        </Button>

        <ShareButton
          variant="brandMono"
          shareLink={`${window.location.origin}${
            window.location.pathname
          }#${convertNameToId(tag.name)}`}
          withIcon
          sharedEntityId={tag.id}
          sharedEntityName="tag"
        >
          Share
        </ShareButton>
      </Flex>
      <Flex justifyContent="space-between" wrap="wrap">
        {sortedHighlights.map((highlight, i) => (
          <HighlightSummaryCard
            onClick={() => openPlayer(i)}
            key={highlight.id}
            highlight={highlight}
          />
        ))}
      </Flex>
      <MultipleHighlightPlayer
        highlights={sortedHighlights}
        currentTagName={tag.name}
        playerGroup={tag.id}
      />
    </Flex>
  );
};
