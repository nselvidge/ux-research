import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { FaFolder } from "react-icons/fa";
import { AddInterviewsButton } from "./AddInterviewsButton";

export const EmptyProjectInterviewList = ({
  workspaceId,
  projectId,
  projectName,
}: {
  workspaceId: string;
  projectId: string;
  projectName: string;
}) => {
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
        Move interviews to your project
      </Heading>
      <Text variant="caption">
        Once you have interviews in your project you can view them here
      </Text>
      <Box marginTop="24px">
        <AddInterviewsButton
          workspaceId={workspaceId}
          projectId={projectId}
          projectName={projectName}
          primary
        />
      </Box>
      <Spacer flexGrow={2} />
    </Flex>
  );
};
