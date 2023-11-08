import { Flex, Heading, Text } from "@chakra-ui/layout";
import {
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useUpdateProjectMutation } from "../requests/projects.generated";

export const ProjectHeader = ({
  projectId,
  projectName,
  projectDescription,
}: {
  projectId: string;
  projectName: string;
  projectDescription: string;
}) => {
  const toast = useToast();
  const [updateProject] = useUpdateProjectMutation();

  return (
    <Flex direction="column" marginBottom="42px">
      <Heading variant="largeTitleBold">
        <Editable
          onSubmit={async (nextName: string) => {
            await updateProject({
              variables: { projectId, name: nextName },
            });
            toast({
              title: "Successfully updated your project name",
              status: "success",
            });
          }}
          defaultValue={projectName}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>{" "}
      </Heading>
      <Text as="div" variant="body">
        <Editable
          onSubmit={async (nextDescription: string) => {
            await updateProject({
              variables: { projectId, description: nextDescription },
            });
            toast({
              title: "Successfully updated your project description",
              status: "success",
            });
          }}
          defaultValue={projectDescription}
          placeholder="Add your project description here"
        >
          <EditablePreview />
          <EditableTextarea resize="none" />
        </Editable>{" "}
      </Text>
    </Flex>
  );
};
