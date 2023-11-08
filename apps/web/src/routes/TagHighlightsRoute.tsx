import { CircularProgress, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useHighlightsForTagQuery } from "~/domains/highlights/requests/highlights.generated";
import { TagHighlights } from "~/domains/highlights/ui/TagHighlights";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { Template } from "~/domains/page/ui/Template";

export const TagHighlightsRoute = ({ tagId }: { tagId: string }) => {
  useRedirectIfNotLoggedIn(`tag/${tagId}`);
  useTrackOnce("Screen Viewed", { screen: "Tag Highlights", tagId });
  const { data, loading } = useHighlightsForTagQuery({
    variables: {
      tagId,
    },
  });

  const currentTag = data?.getHighlightsForTag?.[0].tags.find(
    (tag) => tag.id === tagId
  );

  if (loading || !currentTag) {
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
          highlights={data.getHighlightsForTag}
          currentTag={{ ...currentTag }}
        />
      </Flex>
    </Template>
  );
};
