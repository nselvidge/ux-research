import React from "react";
import { ProjectList } from "~/domains/projects/ui/ProjectList";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { Template } from "~/domains/page/ui/Template";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { Flex, Heading, Spacer } from "@chakra-ui/layout";
import { AddProjectButton } from "~/domains/projects/ui/AddProjectButton";

export const ProjectListRoute = () => {
  const { currentWorkspace } = useCurrentWorkspace();

  if (!currentWorkspace) {
    return <FullPageSpinner />;
  }

  return (
    <Template cream>
      <Flex direction="column" width="100%">
        <Flex width="100%" marginBottom="16px">
          <Heading variant="largeTitleBold">Projects</Heading>
          <Spacer />
          <AddProjectButton workspaceId={currentWorkspace} />
        </Flex>
        <ProjectList workspaceId={currentWorkspace} />
      </Flex>
    </Template>
  );
};
