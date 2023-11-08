import { CircularProgress, Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useProjectTagsQuery } from "~/domains/projectTags/requests/projectTags.generated";
import { ProjectTagList } from "~/domains/projectTags/ui/ProjectTagList";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { useWorkspaceTagDetailsQuery } from "~/domains/tags/requests/tags.generated";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";

export const ProjectTagManagementRoute = ({
  projectId,
}: {
  projectId: string;
}) => {
  const { currentWorkspace } = useCurrentWorkspace();
  useRedirectIfNotLoggedIn(`project/${projectId}/tags`);
  useTrackOnce("Screen Viewed", { screen: "Project Tag Screen" });

  const { data, loading } = useProjectTagsQuery({
    variables: {
      projectId,
    },
  });

  const { data: workspaceData, loading: workspaceLoading } =
    useWorkspaceTagDetailsQuery({
      variables: {
        id: currentWorkspace,
      },
    });

  if (loading || workspaceLoading) {
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
    <ProjectTagList
      workspaceId={currentWorkspace}
      projectId={projectId}
      tags={workspaceData?.workspace?.tags}
      projectTags={data?.project?.projectTags}
    />
  );
};
