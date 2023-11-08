import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  useMoveInterviewsToProjectMutation,
  useWorkspaceProjectsQuery,
  WorkspaceProjectsDocument,
} from "../requests/projects.generated";
import { useListInterviewsQuery } from "~/domains/interview/requests/interviews.generated";
import { FullPageSpinner } from "~/domains/common/ui/FullPageSpinner";
import { MenuOptions } from "~/domains/common/ui/MenuOptions";

export interface MoveInterviewsModalProps {
  isOpen: boolean;
  projectName: string;
  projectId: string;
  onClose: () => void;
  workspaceId: string;
}

export const MoveInterviewsModal = ({
  isOpen,
  onClose,
  projectName,
  projectId,
  workspaceId,
}: MoveInterviewsModalProps) => {
  const [interviewsSelected, setInterviewsSelected] = React.useState<{
    [id: string]: boolean;
  }>({});

  const [selectedProject, setSelectedProject] = React.useState<string | null>(
    null
  );

  const { data: workspaceData, loading: workspaceLoading } =
    useWorkspaceProjectsQuery({
      variables: { workspaceId },
    });

  const { data, loading } = useListInterviewsQuery({
    variables: { workspaceId, projectId: selectedProject },
  });

  const interviews = [...(data?.listInterviews || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [moveInterviews, { loading: loadingMoveInterviews }] =
    useMoveInterviewsToProjectMutation({
      refetchQueries: [
        { query: WorkspaceProjectsDocument, variables: { workspaceId } },
      ],
    });

  const selectedInterviewCount = Object.values(interviewsSelected).filter(
    (selected) => selected
  ).length;

  const projects = [...(workspaceData?.workspace?.projects || [])];
  const projectOptions = [
    {
      label: "Uncategorized",
      value: null,
    },
    ...projects
      .filter((project) => project.id !== projectId)
      .map((project) => ({
        label: `${project.name} (${project.interviewCount})`,
        value: project.id,
      })),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom="4px">
          <Heading variant="titleBold">Move an Interview</Heading>
          <Text
            variant="body"
            fontWeight="400"
            color="gray.700"
            lineHeight="24px"
          >
            Browse your uncategorized interviews and interviews in other
            projects and move them to {projectName}
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {workspaceLoading || !workspaceData?.workspace?.projects ? null : (
            <Box marginBottom="12px">
              <Text>Moving from:</Text>
              <MenuOptions
                options={projectOptions}
                value={selectedProject}
                onChange={(newValue) => {
                  setInterviewsSelected({});
                  setSelectedProject(newValue);
                }}
                menuTitle="Move From Project"
                variant="mono"
              />
            </Box>
          )}
          <Flex
            direction="column"
            maxHeight="300px"
            overflowY="auto"
            alignItems="stretch"
            border="1px solid #E1E1E1"
            borderRadius="12px"
          >
            {loading || !data?.listInterviews ? (
              <FullPageSpinner />
            ) : (
              interviews.map((interview) => (
                <FormControl
                  borderBottom="1px solid #E1E1E1"
                  padding="16px 14px"
                  key={`move-${interview.id}`}
                >
                  <Flex width="100%" padding="4px" alignItems="center">
                    <Checkbox
                      colorScheme="brand"
                      isChecked={interviewsSelected[interview.id]}
                      onChange={(e) =>
                        setInterviewsSelected((current) => ({
                          ...current,
                          [interview.id]: e.target.checked,
                        }))
                      }
                      value={interview.id}
                      marginRight="4px"
                      name={`move-${interview.id}`}
                      flexShrink={1}
                    >
                      <Text
                        textOverflow="ellipsis"
                        as="span"
                        variant="bodyBold"
                        flexShrink={1}
                      >
                        {interview.name}
                      </Text>
                    </Checkbox>

                    <Spacer />
                    <Text flexShrink={0}>
                      {formatDistanceToNow(interview.date)}
                    </Text>
                  </Flex>
                </FormControl>
              ))
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            isLoading={loadingMoveInterviews}
            onClick={async () => {
              await moveInterviews({
                variables: {
                  projectId,
                  interviewIds: Object.keys(interviewsSelected).filter(
                    (id) => interviewsSelected[id]
                  ),
                },
              });
              setSelectedProject(null);
              setInterviewsSelected({});
              onClose();
            }}
            isDisabled={selectedInterviewCount === 0}
          >
            {selectedInterviewCount > 0
              ? `Move ${selectedInterviewCount} Interviews`
              : `Select Interviews to Move`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
