import { Flex } from "@chakra-ui/react";
import React, { ReactNode, useEffect } from "react";
import { SingleHighlightDetails } from "~/domains/highlights/ui/SingleHighlightDetails";
import { SingleHighlightFooter } from "~/domains/highlights/ui/SingleHighlightFooter";
import { useHighlightQuery } from "../requests/interviews.generated";
import { useParsedTranscript } from "../state/parsedTranscript";
import { SingleHighlightTranscript } from "./SingleHighlightTranscript";

const SingleHighlightTranscriptViewContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
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

export const SingleHighlightTranscriptViewer = ({
  highlightId,
}: {
  highlightId: string;
}) => {
  const {
    data: highlightData,
    startPolling,
    stopPolling,
  } = useHighlightQuery({
    variables: { id: highlightId },
  });

  const transcript = highlightData?.highlight?.transcript;
  const groups = useParsedTranscript(transcript);

  useEffect(() => {
    if ((highlightData?.highlight && !transcript) || transcript?.isPending) {
      return startPolling(10000);
    }
    return stopPolling();
  }, [(highlightData?.highlight && !transcript) || transcript?.isPending]);

  if (!highlightData?.highlight) {
    return null;
  }

  return (
    <SingleHighlightTranscriptViewContainer>
      <Flex padding="16px" borderBottom="1px solid #C0C0C0">
        <SingleHighlightDetails
          interviewDate={highlightData.highlight.interview.date}
          interviewName={highlightData.highlight.interview.name}
          tags={highlightData.highlight.tags}
        />
      </Flex>
      <SingleHighlightTranscript highlightId={highlightId} groups={groups} />
      <SingleHighlightFooter
        highlightId={highlightId}
        interviewId={highlightData.highlight.interview.id}
        highlightCount={highlightData.highlight.interview.highlights.length}
      />
    </SingleHighlightTranscriptViewContainer>
  );
};
