import { CircularProgress, Flex, Skeleton } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { VideoPlayer } from "~/domains/videoPlayer/ui/VideoPlayer";
import { useHighlightQuery } from "../requests/interviews.generated";

export const ClipPlayer = ({ highlightId }: { highlightId: string }) => {
  const { data, loading, startPolling, stopPolling } = useHighlightQuery({
    variables: { id: highlightId },
  });

  useEffect(() => {
    if (data?.highlight && !data.highlight.video) {
      return startPolling(3000);
    }
    return stopPolling();
  }, [data?.highlight && !data.highlight.video]);

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

  if (data?.highlight && !data.highlight.video) {
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
        <CircularProgress size="16px" isIndeterminate pr="5px" /> Preparing
        Highlight...
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
      {data?.highlight?.video && (
        <VideoPlayer
          url={data.highlight.video.url}
          previewImageUrl={data.highlight.video?.previewImageUrl}
        />
      )}
    </Flex>
  );
};
