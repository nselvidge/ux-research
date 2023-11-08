import { Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { InterviewList } from "~/domains/interview/ui/InterviewList";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { useProjectQuery } from "~/domains/projects/requests/projects.generated";
import { AddInterviewsButton } from "~/domains/projects/ui/AddInterviewsButton";
import { EmptyProjectInterviewList } from "~/domains/projects/ui/EmptyProjectInterviewList";
import { ProjectHeader } from "~/domains/projects/ui/ProjectHeader";
import { TagPageList } from "~/domains/tags/ui/TagPageList";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";

export const ProjectHomeRoute = ({ projectId }: { projectId: string }) => {
  useRedirectIfNotLoggedIn();
  useTrackOnce("Screen Viewed", {
    screen: "Project",
  });
  const { currentWorkspace } = useCurrentWorkspace();
  const { data: projectData, loading: projectLoading } = useProjectQuery({
    variables: { projectId },
  });
  const interviews = projectData?.project?.interviews
    ? [...projectData.project.interviews]
    : [];

  const sortedInterviews = interviews.sort((a, b) => b.date - a.date);

  return (
    <Flex width="100%" direction="column">
      {projectData?.project?.highlightCounts?.filter(
        (tag) => tag.highlightCount > 0
      )?.length > 0 && (
        <Heading marginBottom="16px" variant="titleBold" color="gray.900">
          Project Highlights
        </Heading>
      )}
      {projectLoading || !projectData ? (
        <FullPageSpinner />
      ) : (
        <TagPageList
          projectId={projectId}
          tags={projectData?.project?.interviewTags}
          tagHighlightCounts={projectData?.project?.highlightCounts}
          taglessHighlightCounts={projectData?.project?.taglessHighlightCounts}
        />
      )}
      <Flex>
        <Heading marginBottom="8px" variant="titleBold" color="gray.900">
          Interviews
        </Heading>
        <Spacer />
        {projectData?.project && (
          <AddInterviewsButton
            projectId={projectId}
            projectName={projectData?.project.name}
            workspaceId={currentWorkspace}
          />
        )}
      </Flex>
      <Text marginBottom="16px" variant="body">
        Sorted by: Newest to oldest
      </Text>
      <Flex flexGrow={1} justifyContent="center">
        {projectLoading || !projectData?.project ? (
          <FullPageSpinner />
        ) : projectData?.project?.interviews?.length === 0 ? (
          <EmptyProjectInterviewList
            workspaceId={currentWorkspace}
            projectId={projectId}
            projectName={projectData?.project.name}
          />
        ) : (
          <InterviewList interviews={sortedInterviews} />
        )}
      </Flex>
    </Flex>
  );
};
