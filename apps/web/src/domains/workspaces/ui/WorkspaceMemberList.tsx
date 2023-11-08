import { Flex, Heading, Icon, Skeleton, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useWorkspaceQuery } from "../requests/workspace.generated";
import { InviteButton } from "./InviteButton";
import { MemberRoleInput } from "./MemberRoleInput";

interface WorkspaceMemberListProps {
  workspaceId: string;
}

export const WorkspaceMemberList = ({
  workspaceId,
}: WorkspaceMemberListProps) => {
  const { data, loading } = useWorkspaceQuery({
    variables: { id: workspaceId },
    skip: !workspaceId,
  });

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Flex direction="column" width="100%">
      {data?.workspace?.pendingInvites?.length > 0 && (
        <Flex alignItems="center">
          <Heading as="h2" size="md">
            Pending Invites
          </Heading>
          <Spacer />
          <InviteButton workspaceId={workspaceId} />
        </Flex>
      )}
      {data?.workspace?.pendingInvites?.map((invite) => (
        <Flex key={`role-${invite.id}`} width="100%" marginBottom="24px">
          <Flex margin="15px" borderRadius="35px" alignItems="center">
            <Icon as={() => <FaUserCircle size="35px" />} />
          </Flex>
          <Flex direction="column" padding="15px" justifyContent="center">
            <Heading as="h3" size="sm">
              {invite.email}
            </Heading>
          </Flex>
          <Spacer />
          <Flex alignItems="center">
            <MemberRoleInput />
          </Flex>
        </Flex>
      ))}
      <Flex>
        <Heading as="h2" size="md">
          Workspace Members
        </Heading>
        <Spacer />
        {data?.workspace?.pendingInvites?.length > 0 ? null : (
          <InviteButton workspaceId={workspaceId} />
        )}
      </Flex>
      {data?.workspace?.roles.map((role) => (
        <Flex key={`role-${role.user.id}`} width="100%">
          <Flex margin="15px" borderRadius="35px" alignItems="center">
            <Icon as={() => <FaUserCircle size="35px" />} />
          </Flex>
          <Flex direction="column" padding="15px" justifyContent="center">
            <Heading as="h3" size="sm">
              {role.user.fullName}
            </Heading>
            <Text color="#8e8e8e">{role.user.email}</Text>
          </Flex>
          <Spacer />
          <Flex alignItems="center">
            <MemberRoleInput />
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
