import { Box, Flex, Grid, Heading } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import React, { useMemo } from "react";
import { filter, pipe, reverse, sortBy } from "remeda";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import {
  useWorkspaceTagDetailsQuery,
  WorkspaceTagDetailsQuery,
} from "../requests/tags.generated";
import { TagPageCard } from "./TagPageCard";

export interface TagPageListProps {
  projectId?: string;
  tags: WorkspaceTagDetailsQuery["workspace"]["tags"];
  tagHighlightCounts: WorkspaceTagDetailsQuery["getTagHighlightCounts"];
  taglessHighlightCounts: WorkspaceTagDetailsQuery["getTaglessHighlightCounts"];
}

export const TagPageList = ({
  projectId,
  tags,
  tagHighlightCounts,
  taglessHighlightCounts,
}: TagPageListProps) => {
  const tagsWithCounts = useMemo(
    () =>
      tags
        ? pipe(
            tags,
            // filter tags without any highlights
            filter(
              (tag) =>
                tagHighlightCounts.find((count) => count.tagId === tag.id)
                  ?.highlightCount > 0
            ),
            sortBy((tag) => {
              return (
                tagHighlightCounts.find((count) => count.tagId === tag.id)
                  ?.highlightCount || 0
              );
            }),
            reverse()
          )
        : [],
    [tags, tagHighlightCounts]
  );

  if (!tagsWithCounts.length) {
    return null;
  }

  return (
    <>
      <Flex flexGrow={1} justifyContent="center">
        <Box width="100%" marginBottom="16px">
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
              xl: "repeat(6, 1fr)",
            }}
            gridGap="16px 8px"
            justifyContent="space-evenly"
            alignItems="stretch"
          >
            {tagsWithCounts.map((tag) => (
              <TagPageCard
                emoji={tag.emoji}
                key={tag.id}
                id={tag.id}
                name={tag.name}
                highlightCount={
                  tagHighlightCounts.find((count) => count.tagId === tag.id)
                    ?.highlightCount || 0
                }
                color={`${tag.color}.100`}
                projectId={projectId}
              />
            ))}
            {taglessHighlightCounts > 0 && (
              <TagPageCard
                emoji={"26a1"}
                id="tagless"
                name="Other Highlights"
                highlightCount={taglessHighlightCounts}
                color={`gray.100`}
                projectId={projectId}
              />
            )}
          </Grid>
        </Box>
      </Flex>
    </>
  );
};
