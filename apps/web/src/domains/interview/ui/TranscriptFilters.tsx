import { Box, Button, Text } from "@chakra-ui/react";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import React, { ReactNode, useMemo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
  first,
  flatMap,
  groupBy,
  map,
  pipe,
  prop,
  sortBy,
  toPairs,
} from "remeda";
import { TagColor } from "~/global/generated/graphql";
import { useInterviewHighlightsQuery } from "../requests/interviews.generated";
import { useTranscriptMode } from "../state/transcriptMode";

const FilterButton = ({
  children,
  onClick,
  color,
  emoji,
  isActive,
  count,
  loading,
}: {
  children: ReactNode;
  onClick: () => void;
  color: TagColor;
  emoji?: string;
  isActive: boolean;
  loading?: boolean;
  count?: number;
}) => (
  <Button
    padding="8px 12px"
    onClick={onClick}
    background={`${color}.100`}
    border={isActive ? "2px solid" : "none"}
    borderColor="gray.900"
    margin="4px"
    borderRadius="8px"
    isLoading={loading}
    _hover={{ backgroundColor: `${color}.300` }}
    _selected={{ backgroundColor: `${color}.400` }}
    flexShrink={0}
    leftIcon={
      isActive ? (
        <FaCheckCircle color="green" />
      ) : (
        <Box
          width="12px"
          height="12px"
          borderRadius="6px"
          borderColor="gray.900"
          border="2px solid"
          opacity="0.5"
        />
      )
    }
  >
    {emoji && <Emoji unified={emoji} size={16} />}
    <Text marginLeft="4px" as="span" variant="captionBold">
      {children}
    </Text>{" "}
    {count && (
      <Text as="span" paddingLeft="4px" variant="caption">
        {count}
      </Text>
    )}
  </Button>
);

export const TranscriptFilters = ({ interviewId }: { interviewId: string }) => {
  const {
    transcriptMode: { mode, tagIds },
    setMode,
    addTag,
    removeTag,
  } = useTranscriptMode();

  const { data, loading } = useInterviewHighlightsQuery({
    variables: { id: interviewId },
  });

  const tagDetails = useMemo(() => {
    return pipe(
      data?.interview?.highlights || [],
      flatMap(prop("tags")),
      groupBy(prop("id")),
      toPairs,
      sortBy((pair) => -pair[1].length),
      map((pair) => {
        const tag = first(pair[1]);
        return {
          name: tag.name,
          color: tag.color,
          id: tag.id,
          count: pair[1].length,
          emoji: tag.emoji,
        };
      })
    );
  }, [data]);

  return (
    <>
      <FilterButton
        isActive={mode === "full"}
        onClick={() => setMode("full")}
        color={"orange" as TagColor} // Orange is not a tag color but is used for all highlights
        loading={loading}
      >
        All Highlights
      </FilterButton>
      {data?.interview?.suggestedHighlights?.length > 0 && (
        <FilterButton
          isActive={mode === "suggested"}
          onClick={() => setMode("suggested")}
          color={"yellow" as TagColor} // Yellow is not a tag color but is used for all highlights
          loading={loading}
          count={data?.interview?.suggestedHighlights?.length}
        >
          Suggested highlights
        </FilterButton>
      )}
      {tagDetails.length > 0 &&
        tagDetails.map((tag) => (
          <FilterButton
            key={tag.id}
            count={tag.count}
            color={tag.color}
            emoji={tag.emoji}
            isActive={tagIds.includes(tag.id)}
            onClick={() => {
              tagIds.includes(tag.id) ? removeTag(tag.id) : addTag(tag.id);
            }}
          >
            {tag.name}
          </FilterButton>
        ))}
    </>
  );
};
