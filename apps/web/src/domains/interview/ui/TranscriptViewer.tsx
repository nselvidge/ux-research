import { Flex } from "@chakra-ui/react";
import React, { ReactNode, useEffect } from "react";
import { useInterviewQuery } from "../requests/interviews.generated";
import { useParsedTranscript } from "../state/parsedTranscript";
import { useTranscriptMode } from "../state/transcriptMode";
import { Transcript } from "./Transcript";
import { TranscriptFilters } from "./TranscriptFilters";

const TranscriptViewContainer = ({ children }: { children: ReactNode }) => (
  <Flex
    direction="column"
    width="100%"
    maxWidth="700px"
    position="relative"
    height="100%"
    border="1px solid #C0C0C0"
    borderRadius="10px"
    background="white"
  >
    {children}
  </Flex>
);

export const TranscriptViewer = ({ interviewId }: { interviewId: string }) => {
  const {
    transcriptMode: { mode, tagIds },
    setMode,
  } = useTranscriptMode();

  useEffect(() => {
    return () => {
      setMode("full");
    };
  }, []);

  const {
    data: interviewData,
    startPolling: startPollingInterview,
    stopPolling: stopPollingInterview,
  } = useInterviewQuery({
    variables: { id: interviewId },
  });

  const transcript = interviewData?.interview?.transcript;
  const groups = useParsedTranscript(transcript);

  useEffect(() => {
    if ((interviewData?.interview && !transcript) || transcript?.isPending) {
      return startPollingInterview(10000);
    }
    return stopPollingInterview();
  }, [(interviewData?.interview && !transcript) || transcript?.isPending]);

  return (
    <TranscriptViewContainer>
      <Flex
        alignItems="center"
        padding="16px"
        borderBottom="1px solid #C0C0C0"
        flexWrap="wrap"
        maxHeight="116px"
        overflowY="auto"
        flexShrink={0}
      >
        <TranscriptFilters interviewId={interviewId} />
      </Flex>

      <Transcript
        groups={groups}
        interviewId={interviewId}
        activeTagIds={tagIds}
        highlightMode={mode}
      />
    </TranscriptViewContainer>
  );
};
