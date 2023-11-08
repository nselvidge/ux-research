import { Flex } from "@chakra-ui/layout";
import React, { useMemo } from "react";
import {
  flatMap,
  groupBy,
  map,
  mapToObj,
  mapValues,
  pipe,
  sortBy,
  toPairs,
} from "remeda";
import { HighlightSummaryData } from "./HighlightSummaryCard";
import { TagSummary } from "./TagSummary";

interface HighlightWithTags extends HighlightSummaryData {
  tags: {
    id: string;
    name: string;
  }[];
}

export interface TagSummariesProps {
  tags: {
    id: string;
    name: string;
  }[];
  highlights: HighlightWithTags[];
}

export const TagSummaries = ({ highlights, tags }: TagSummariesProps) => {
  const tagGroups = useMemo(
    () =>
      pipe(
        highlights,
        flatMap((highlight) =>
          highlight.tags.map((tag) => [tag, highlight] as const)
        ),
        groupBy(([{ id }]) => id),
        mapValues((highlights) =>
          map(highlights, ([, highlight]) => highlight)
        ),
        toPairs,
        sortBy(([, highlights]) => -highlights.length)
      ),
    [highlights]
  );

  const taglessHighlights = useMemo(
    () =>
      highlights.filter(
        (highlight) => highlight.tags.length === 0
      ) as HighlightSummaryData[],
    [highlights]
  );

  const tagMapping = useMemo(
    () => mapToObj(tags, (tag) => [tag.id, tag]),
    [tags]
  );

  return (
    <Flex direction="column" width="100%">
      {tagGroups.map(([tagId, highlights]) => (
        <TagSummary
          key={tagId}
          tag={tagMapping[tagId]}
          highlights={highlights}
        />
      ))}
      {taglessHighlights.length > 0 && (
        <TagSummary
          tag={{
            id: "other-highlights",
            name: "Other Highlights",
          }}
          highlights={taglessHighlights}
        />
      )}
    </Flex>
  );
};
