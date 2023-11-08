import { CircularProgress, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  GetPendingInterviewDocument,
  useCreatePendingInterviewMutation,
} from "~/domains/conduct/requests/conduct.generated";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { useCloudRecording } from "../requests/zoom";

export const RecordingWithoutInterview = () => {
  const { currentWorkspace } = useCurrentWorkspace();
  const { meetingId } = useCloudRecording(false);
  const [createPendingInterview] = useCreatePendingInterviewMutation({
    variables: { externalId: meetingId, workspaceId: currentWorkspace },
    refetchQueries: [
      {
        query: GetPendingInterviewDocument,
        variables: { externalId: meetingId },
      },
    ],
  });

  useEffect(() => {
    createPendingInterview();
  }, []);

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <CircularProgress color="brand.500" isIndeterminate />
    </Flex>
  );
};
