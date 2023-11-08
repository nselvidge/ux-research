import { Box, CircularProgress, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { CreateTagButton } from "~/domains/tags/ui/CreateTagButton";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { TagManagementList } from "~/domains/workspaces/ui/TagManagementList";

export const TagSettingsRoute = () => {
  useRedirectIfNotLoggedIn("workspace/tags");
  const { currentWorkspace } = useCurrentWorkspace();
  useTrackOnce("Screen Viewed", {
    screen: "Tag Settings",
  });

  return currentWorkspace ? (
    <Box width="100%">
      <Flex width="100%" alignItems="center">
        <Text variant="bodyBold">Tags</Text>
        <Spacer />
        <CreateTagButton workspaceId={currentWorkspace} />
      </Flex>
      <TagManagementList workspaceId={currentWorkspace} />
    </Box>
  ) : (
    <Flex width="100%" justifyContent="center" alignItems="center">
      <CircularProgress isIndeterminate color="brand.500" />
    </Flex>
  );
};
