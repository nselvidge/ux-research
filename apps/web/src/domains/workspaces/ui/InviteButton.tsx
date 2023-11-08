import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa";
import InviteModal from "./InviteModal";

interface InviteButtonProps {
  workspaceId: string;
}

export const InviteButton = ({ workspaceId }: InviteButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button variant="brand" onClick={onOpen} leftIcon={<FaPlus />}>
        Invite coworkers
      </Button>
      <InviteModal
        isOpen={isOpen}
        onClose={onClose}
        workspaceName="My Workspace"
        workspaceId={workspaceId}
      />
    </>
  );
};
