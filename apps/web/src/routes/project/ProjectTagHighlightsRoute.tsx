import { CircularProgress, Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useHighlightsForTagQuery } from "~/domains/highlights/requests/highlights.generated";
import { TagHighlights } from "~/domains/highlights/ui/TagHighlights";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";

export const ProjectTagHighlightsRoute = ({
  tagId,
  projectId,
}: {
  tagId: string;
  projectId: string;
}) => {
  useRedirectIfNotLoggedIn(`project/${projectId}/tag/${tagId}`);
  useTrackOnce("Screen Viewed", { screen: "Tag Highlights", tagId });
  const { data, loading } = useHighlightsForTagQuery({
    variables: {
      tagId,
      projectId,
    },
  });

  const currentTag = data?.getHighlightsForTag?.[0].tags.find(
    (tag) => tag.id === tagId
  );

  if (loading || !currentTag) {
    return (
      <Flex
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress isIndeterminate color="brand.500" />
      </Flex>
    );
  }

  return (
    <Flex flexGrow={1} justifyContent="center">
      <TagHighlights
        highlights={data.getHighlightsForTag}
        currentTag={{ ...currentTag }}
      />
    </Flex>
  );
};
