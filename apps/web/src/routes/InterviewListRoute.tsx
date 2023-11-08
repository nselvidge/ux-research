import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { useListInterviewsQuery } from "~/domains/interview/requests/interviews.generated";
import { EmptyInterviewList } from "~/domains/interview/ui/EmtpyInterviewList";
import { InterviewList } from "~/domains/interview/ui/InterviewList";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { Template } from "~/domains/page/ui/Template";
import { useWorkspaceTagDetailsQuery } from "~/domains/tags/requests/tags.generated";
import { TagPageList } from "~/domains/tags/ui/TagPageList";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";

export const InterviewListRoute = () => {
  useRedirectIfNotLoggedIn();
  useTrackOnce("Screen Viewed", {
    screen: "Interview",
  });
  const { currentWorkspace } = useCurrentWorkspace();
  const { data, loading } = useListInterviewsQuery({
    variables: { workspaceId: currentWorkspace },
    skip: !currentWorkspace,
  });

  const { data: workspaceData, loading: workspaceLoading } =
    useWorkspaceTagDetailsQuery({
      variables: { id: currentWorkspace },
      skip: !currentWorkspace,
    });

  return (
    <Template cream>
      <Flex width="100%" direction="column">
        {workspaceData?.getTagHighlightCounts?.filter(
          (tag) => tag.highlightCount > 0
        )?.length > 0 && (
          <Heading marginBottom="16px" variant="titleBold">
            Top Highlights
          </Heading>
        )}
        {workspaceLoading || !workspaceData?.workspace?.tags ? (
          <FullPageSpinner />
        ) : (
          <TagPageList
            tags={workspaceData?.workspace?.tags}
            tagHighlightCounts={workspaceData?.getTagHighlightCounts}
            taglessHighlightCounts={workspaceData?.getTaglessHighlightCounts}
          />
        )}
        <Heading marginBottom="8px" variant="titleBold">
          All Interviews
        </Heading>
        <Text marginBottom="16px" variant="body">
          Sorted by: Newest to oldest
        </Text>
        <Flex flexGrow={1} justifyContent="center">
          {loading || !data?.listInterviews ? (
            <FullPageSpinner />
          ) : data?.listInterviews.length === 0 ? (
            <EmptyInterviewList />
          ) : (
            <InterviewList interviews={data?.listInterviews} />
          )}
        </Flex>
      </Flex>
    </Template>
  );
};
