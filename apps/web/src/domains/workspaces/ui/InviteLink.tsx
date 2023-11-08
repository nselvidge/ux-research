import { Button, Flex, Skeleton, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FaLink } from "react-icons/fa";
import { trackEvent } from "~/domains/analytics/tracker";
import {
  useCreateInviteTokenMutation,
  useWorkspaceQuery,
} from "../requests/workspace.generated";
import { useCurrentWorkspace } from "../state/currentWorkspace";

export const InviteLink = () => {
  const { currentWorkspace: workspaceId } = useCurrentWorkspace();
  const toast = useToast();
  const { data, loading, error } = useWorkspaceQuery({
    variables: { id: workspaceId },
    skip: !workspaceId,
  });
  const [
    createInviteToken,
    { loading: loadingMutation, error: errorMutation },
  ] = useCreateInviteTokenMutation({
    variables: { workspaceId },
  });
  useEffect(() => {
    if (
      data &&
      !loading &&
      !loadingMutation &&
      !error &&
      !errorMutation &&
      !data.workspace.currentUserInviteToken
    ) {
      createInviteToken();
    }
  }, [data, loading, loadingMutation, error, errorMutation]);
  const token = data?.workspace?.currentUserInviteToken;
  const url = token
    ? `${window.location.protocol}//${window.location.host}/invite/${token}`
    : "";

  const onClick = async () => {
    await navigator.clipboard.writeText(url);
    toast({ status: "success", title: "Copied invite link to clipboard" });
    trackEvent("Invite Link Copied", {
      entityName: "Workspace",
      entityId: workspaceId,
    });
  };

  return token ? (
    <>
      <Flex paddingBottom="8px">
        <Button onClick={onClick} variant="brandMono" leftIcon={<FaLink />}>
          Copy link
        </Button>
      </Flex>
    </>
  ) : (
    <Skeleton />
  );
};
