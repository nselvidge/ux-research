import React from "react";
import {
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { InviteLink } from "./InviteLink";
import { InviteMember } from "./InviteMember";

interface InviteModalProps {
  workspaceName: string;
  onClose: () => void;
  isOpen: boolean;
  workspaceId: string;
}

export default function InviteModal({
  workspaceName,
  workspaceId,
  onClose,
  isOpen,
}: InviteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading variant="largeTitleBold">Invite to {workspaceName}</Heading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody padding="0px">
          <Flex direction="column">
            <Flex direction="column" padding="12px 24px 24px">
              <Text marginBottom="12px" variant="largeBodyBold">
                Send your coworkers an invite
              </Text>
              <InviteMember workspaceId={workspaceId} onAddMember={onClose} />
            </Flex>
            <Flex
              padding="24px"
              borderTopWidth="1px"
              borderTopStyle="solid"
              borderTopColor="gray.300"
              direction="column"
            >
              <Text marginBottom="12px" variant="largeBodyBold">
                Share invite link
              </Text>
              <Flex>
                <Text variant="caption">
                  Anyone with this link will be able to join your workspace.
                </Text>
                <InviteLink />
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
