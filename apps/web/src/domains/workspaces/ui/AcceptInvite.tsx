import { Flex, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import React from "react";
import {
  useAcceptInviteMutation,
  useRejectInviteMutation,
} from "../requests/workspace.generated";

export interface AcceptInviteProps {
  pendingWorkspaceInvite: {
    inviterName: string;
    workspaceName: string;
    workspaceId: string;
  };
}

export const AcceptInvite = ({ pendingWorkspaceInvite }: AcceptInviteProps) => {
  const [acceptInvite, { loading: loadingAccept }] = useAcceptInviteMutation({
    variables: {
      workspaceId: pendingWorkspaceInvite.workspaceId,
    },
  });
  const [rejectInvite, { loading: loadingReject }] = useRejectInviteMutation({
    variables: {
      workspaceId: pendingWorkspaceInvite.workspaceId,
    },
  });

  return (
    <Flex
      direction="column"
      maxWidth={{
        base: "100%",
        md: "450px",
      }}
      borderColor="gray.300"
      borderWidth="1px"
      borderStyle="solid"
      padding="32px"
      borderRadius="8px"
      textAlign="center"
    >
      <Heading variant="titleBold" marginBottom="16px">
        You're invited!
      </Heading>
      <Text variant="body" marginBottom="24px">
        <Text as="span" variant="bodyBold">
          {pendingWorkspaceInvite.inviterName}
        </Text>{" "}
        has invited you to join{" "}
        <Text as="span" variant="bodyBold">
          {pendingWorkspaceInvite.workspaceName}
        </Text>
      </Text>
      <Button
        onClick={() => acceptInvite()}
        isLoading={loadingAccept || loadingReject}
        variant="brand"
        marginBottom="32px"
      >
        Join
        <Text marginLeft="4px" as="span" fontWeight="bold">
          {" "}
          {pendingWorkspaceInvite.workspaceName}
        </Text>
      </Button>
      <Spacer />
      <Text variant="caption">
        If you think you received this invitation in error,{" "}
        <Button
          isLoading={loadingAccept || loadingReject}
          onClick={() => rejectInvite()}
          variant="link"
        >
          click here.
        </Button>
      </Text>
    </Flex>
  );
};
