import { Box, CircularProgress, Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { PublicInterviewLinkSetting } from "~/domains/workspaces/ui/PublicInterviewLinksSetting";
import { WorkspaceMemberList } from "~/domains/workspaces/ui/WorkspaceMemberList";
import { WorkspaceName } from "~/domains/workspaces/ui/WorkspaceName";

export const MembershipSettingsRoute = () => {
  useRedirectIfNotLoggedIn("workspace/members");
  const { currentWorkspace } = useCurrentWorkspace();
  useTrackOnce("Screen Viewed", {
    screen: "Membership Settings",
  });

  return currentWorkspace ? (
    <Box width="100%">
      <WorkspaceName workspaceId={currentWorkspace} />
      <PublicInterviewLinkSetting workspaceId={currentWorkspace} />
      <WorkspaceMemberList workspaceId={currentWorkspace} />
    </Box>
  ) : (
    <Flex width="100%" justifyContent="center" alignItems="center">
      <CircularProgress isIndeterminate color="brand.500" />
    </Flex>
  );
};
