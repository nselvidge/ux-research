import React, { useRef } from "react";
import { Box, CircularProgress, Flex, SkeletonText } from "@chakra-ui/react";

import { usePlayerContext } from "~/domains/videoPlayer/state/playerContext";
import { TranscriptGroup } from "./transcript/TranscriptGroup";
import { ContinueTrackingPrompt } from "./transcript/ContinueTrackingPrompt";
import { useHighlightQuery } from "../requests/interviews.generated";
import { TranscriptGroupData } from "../state/parsedTranscript";
import { ActiveWord } from "./transcript/ActiveWord";

interface TranscriptProps {
  highlightId: string;
  groups?: TranscriptGroupData[];
}

export const SingleHighlightTranscript: React.FC<TranscriptProps> = ({
  highlightId,
  groups,
}) => {
  const scrollContainerRef = useRef();
  const { data, loading, error } = useHighlightQuery({
    variables: { id: highlightId },
  });
  const transcript = data?.highlight?.transcript;

  const { seekTo } = usePlayerContext();

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
      flexShrink={2}
      minHeight={0}
    >
      <Flex
        direction="column"
        ref={scrollContainerRef}
        position="relative"
        overflowY="auto"
        overflowX="visible"
        width="calc(100% + 350px)"
        padding="22px 22px 22px 372px"
        marginLeft="-350px"
        height="100%"
        id="transcript-container"
      >
        {error ? (
          "There was a problem generating your transcript"
        ) : loading ? (
          <SkeletonText />
        ) : !transcript || transcript.isPending ? (
          <Flex justifyContent="center" alignItems="center" height="300px">
            <CircularProgress pr="5px" size="16px" isIndeterminate />
            {" Transcript is being processed..."}
          </Flex>
        ) : (
          groups.map((group, i) => (
            <TranscriptGroup
              key={`transcript-group-${i}-speaker-${group.speaker.name}`}
              group={group}
              isInterviewer={i % 2 === 0}
              seekTo={seekTo}
              userCanEdit={false}
              updateName={() => Promise.resolve()}
            />
          ))
        )}
        <ActiveWord scrollContainerRef={scrollContainerRef} groups={groups} />
      </Flex>
      <ContinueTrackingPrompt scrollContainerRef={scrollContainerRef} />
    </Box>
  );
};
