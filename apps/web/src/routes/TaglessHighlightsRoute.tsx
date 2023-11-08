import { CircularProgress, Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useHighlightsWithoutTagQuery } from "~/domains/highlights/requests/highlights.generated";
import { TagHighlights } from "~/domains/highlights/ui/TagHighlights";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { Template } from "~/domains/page/ui/Template";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";

export const TaglessHighlightsRoute = () => {
  useRedirectIfNotLoggedIn(`tag/tagless`);
  useTrackOnce("Screen Viewed", { screen: "Tag Highlights", tagId: "tagless" });
  const { currentWorkspace: workspaceId } = useCurrentWorkspace();

  const { data, loading } = useHighlightsWithoutTagQuery({
    variables: {
      workspaceId,
    },
    skip: !workspaceId,
  });

  if (loading || !workspaceId) {
    return (
      <Template cream>
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress isIndeterminate color="brand.500" />
        </Flex>
      </Template>
    );
  }

  return (
    <Template cream>
      <Flex flexGrow={1} justifyContent="center">
        <TagHighlights
          highlights={data?.getHighlightsWithoutTag}
          currentTag={{
            id: "tagless",
            color: "gray",
            name: "Other Highlights",
            emoji: "26a1",
          }}
        />
      </Flex>
    </Template>
  );
};
