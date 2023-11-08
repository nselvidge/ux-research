import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { FaFolder, FaPlus } from "react-icons/fa";
import { CreateProjectModal } from "./CreateProjectModal";

export const EmptyProjectList = ({ workspaceId }: { workspaceId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Spacer flexGrow={1} />
      <FaFolder size="32px" />
      <Heading marginTop="8px" variant="titleBold">
        You don't have any projects yet
      </Heading>
      <Text variant="caption">
        Create a new project to organize your interviews by team or by
        initiative
      </Text>
      <Box marginTop="24px">
        <Button
          leftIcon={<FaPlus aria-hidden="true" />}
          variant="brand"
          onClick={onOpen}
        >
          Create Project
        </Button>
        <CreateProjectModal
          workspaceId={workspaceId}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Box>
      <Spacer flexGrow={2} />
    </Flex>
  );
};
