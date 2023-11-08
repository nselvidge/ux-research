import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { SelectInput } from "~/domains/common/ui/SelectInput";
import { StartRecordingButton } from "./StartRecordingButton";

export const NotRecording = ({
  startInterview,
  loading,
  localRecording,
  projectOptions,
  onProjectChange,
  currentProjectId,
}: {
  startInterview: () => void;
  loading: boolean;
  localRecording: boolean;
  projectOptions: { label: string; value: string | null }[];
  onProjectChange: (projectId: string | null) => void;
  currentProjectId: string | null;
}) => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      height="100%"
      justifyContent="center"
      width="100%"
    >
      {localRecording && (
        <Alert
          status="warning"
          marginBottom="16px"
          marginTop="-50px"
          flexDirection="column"
          borderRadius="8px"
        >
          <AlertIcon />
          <AlertTitle>
            You are currently recording to your computer. Please stop your local
            recording and start a cloud recording. This will make sure your
            interview automatically is imported into your Resonate workspace.
          </AlertTitle>
        </Alert>
      )}

      <Box width="100%" marginTop={localRecording ? undefined : "-50px"}>
        {projectOptions && projectOptions.length > 1 && (
          <Flex
            direction="column"
            width="100%"
            alignItems="start"
            marginBottom="16px"
          >
            <Text variant="caption" marginBottom="8px">
              Project
            </Text>
            <SelectInput
              width="100%"
              variant="brandMono"
              options={projectOptions}
              value={currentProjectId}
              onChange={onProjectChange}
            />
          </Flex>
        )}
        <StartRecordingButton
          startInterview={startInterview}
          loading={loading}
        />
      </Box>
    </Flex>
  );
};
