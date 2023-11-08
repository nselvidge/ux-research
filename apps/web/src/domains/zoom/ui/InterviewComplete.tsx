import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import {
  useGetPendingInterviewByRecordingTargetQuery,
  useGetPendingInterviewQuery,
} from "~/domains/conduct/requests/conduct.generated";
import { useZoomClient } from "../requests/zoom";

export const InterviewComplete = ({ version }: { version: "" | "V2" }) => {
  const { zoom, meetingId } = useZoomClient();
  const { data: dataV1 } = useGetPendingInterviewQuery({
    variables: { externalId: meetingId },
    skip: version === "V2",
  });

  const { data: dataV2 } = useGetPendingInterviewByRecordingTargetQuery({
    variables: { externalId: meetingId },
    skip: version !== "V2",
  });

  const interviewId =
    dataV1?.getPendingInterview.id ||
    dataV2?.getPendingInterviewByRecordingTarget.id;

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <Spacer />
      <Box marginTop="-50px" width="100%">
        <Button
          display="inline"
          onClick={() =>
            zoom.openUrl({
              url: `https://${window.location.hostname}/interview/${interviewId}`,
            })
          }
          width="100%"
          variant="brand"
          fontSize="20px"
          height="68px"
        >
          Open your interview
        </Button>
      </Box>
      <Spacer />
      <Text textAlign="center" variant="caption">
        Open your interview in the Resonate dashboard to see your transcript and
        highlights. You'll need to leave the Zoom meeting to allow Zoom to
        prepare the recording.
      </Text>
    </Flex>
  );
};
