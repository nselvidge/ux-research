import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { CreateProjectModal } from "./CreateProjectModal";

export const AddProjectButton = ({ workspaceId }: { workspaceId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        leftIcon={<FaPlus aria-hidden="true" />}
        variant="brandMono"
        onClick={onOpen}
      >
        Create Project
      </Button>
      <CreateProjectModal
        workspaceId={workspaceId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
