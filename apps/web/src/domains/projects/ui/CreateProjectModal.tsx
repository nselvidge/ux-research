import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useLocation } from "wouter";
import {
  useCreateProjectMutation,
  WorkspaceProjectsDocument,
} from "../requests/projects.generated";

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export const CreateProjectModal = ({
  isOpen,
  onClose,
  workspaceId,
}: CreateProjectModalProps) => {
  const [, navigate] = useLocation();
  const [projectName, setProjectName] = React.useState("");
  const [projectDescription, setProjectDescription] = React.useState("");
  const [createProject, { loading }] = useCreateProjectMutation({
    refetchQueries: [
      { query: WorkspaceProjectsDocument, variables: { workspaceId } },
    ],
  });

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading marginBottom="8px" variant="titleBold">
            Create Project
          </Heading>
          <Text
            variant="body"
            fontWeight="400"
            color="gray.700"
            lineHeight="24px"
          >
            Group your interviews into projects by team or goal
          </Text>
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody>
          <FormControl marginBottom="16px">
            <FormLabel>Project Name</FormLabel>
            <Input
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
            />
          </FormControl>
          <FormControl marginBottom="24px">
            <FormLabel>Project Description</FormLabel>
            <Textarea
              onChange={(e) => setProjectDescription(e.target.value)}
              resize="none"
              placeholder="Description"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter borderTop="1px solid #E1E1E1">
          <Button
            onClick={async () => {
              const result = await createProject({
                variables: {
                  workspaceId,
                  name: projectName,
                  description: projectDescription,
                },
              });

              if (result.data?.createProject) {
                navigate(`/project/${result.data.createProject.id}`);
                onClose();
              }
            }}
            variant="brand"
            isLoading={loading}
          >
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
