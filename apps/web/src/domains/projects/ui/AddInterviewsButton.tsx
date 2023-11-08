import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { MoveInterviewsModal } from "./MoveInterviewsModal";

export interface AddInterviewsButtonProps {
  projectId: string;
  projectName: string;
  workspaceId: string;
  primary?: boolean;
}

export const AddInterviewsButton = ({
  projectId,
  projectName,
  workspaceId,
  primary,
}: AddInterviewsButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        leftIcon={<FaPlus />}
        onClick={onOpen}
        variant={primary ? "brand" : "brandMono"}
      >
        Add Interviews
      </Button>
      <MoveInterviewsModal
        workspaceId={workspaceId}
        isOpen={isOpen}
        onClose={onClose}
        projectId={projectId}
        projectName={projectName}
      />
    </>
  );
};
