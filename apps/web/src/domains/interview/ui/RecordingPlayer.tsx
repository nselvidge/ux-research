import { CircularProgress, Flex, Skeleton } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { VideoPlayer } from "~/domains/videoPlayer/ui/VideoPlayer";
import { useInterviewQuery } from "../requests/interviews.generated";

export const RecordingPlayer = ({ interviewId }: { interviewId: string }) => {
  const { data, loading, startPolling, stopPolling } = useInterviewQuery({
    variables: { id: interviewId },
  });

  useEffect(() => {
    if (data?.interview && !data.interview.recording) {
      return startPolling(3000);
    }
    return stopPolling();
  }, [data?.interview && !data.interview.recording]);

  if (loading) {
    return (
      <Skeleton
        flexGrow={1}
        width="100%"
        borderRadius="10px"
        border="1px solid #C0C0C0"
        flexShrink={0}
      />
    );
  }

  if (data?.interview && !data.interview.recording) {
    return (
      <Flex
        width="100%"
        height="100%"
        border="1px solid #C0C0C0"
        borderRadius="10px"
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size="16px" isIndeterminate pr="5px" /> Uploading
        Recording...
      </Flex>
    );
  }

  return (
    <Flex
      width="100%"
      flexGrow={1}
      background="#000"
      justifyContent="center"
      alignItems="center"
      borderRadius="16px"
    >
      {" "}
      {data?.interview?.recording && (
        <VideoPlayer
          url={data.interview.recording.url}
          previewImageUrl={data.interview.recording.previewImageUrl}
        />
      )}
    </Flex>
  );
};
