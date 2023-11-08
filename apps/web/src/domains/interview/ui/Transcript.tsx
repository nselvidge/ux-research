import React, { useCallback, useRef } from "react";
import {
  Box,
  CircularProgress,
  Flex,
  SkeletonText,
  useToast,
} from "@chakra-ui/react";

import { usePlayerContext } from "~/domains/videoPlayer/state/playerContext";
import { TranscriptGroup } from "./transcript/TranscriptGroup";
import { ContinueTrackingPrompt } from "./transcript/ContinueTrackingPrompt";
import {
  useInterviewQuery,
  useUpdateSpeakerNameMutation,
} from "../requests/interviews.generated";
import { SelectionPrompt } from "./transcript/SelectionPrompt";
import { TranscriptGroupData } from "../state/parsedTranscript";
import { ActiveWord } from "./transcript/ActiveWord";
import { Highlights } from "./transcript/Highlights";
import { SuggestedHighlights } from "./transcript/SuggestedHighlights";

interface TranscriptProps {
  interviewId: string;
  groups?: TranscriptGroupData[];
  activeTagIds?: string[];
  highlightMode?: "full" | "tags" | "suggested";
}

export const Transcript: React.FC<TranscriptProps> = ({
  interviewId,
  groups,
  activeTagIds,
  highlightMode,
}) => {
  const toast = useToast();
  const scrollContainerRef = useRef();
  const { data, loading, error } = useInterviewQuery({
    variables: { id: interviewId },
  });
  const transcript = data?.interview?.transcript;
  const [baseUpdateName] = useUpdateSpeakerNameMutation();

  const { seekTo } = usePlayerContext();

  const updateName = useCallback(
    async (speakerId: string, newName: string) => {
      try {
        await baseUpdateName({
          variables: { speakerId, newName, interviewId },
          optimisticResponse: {
            updateSpeakerName: {
              id: speakerId,
              name: newName,
              __typename: "Participant",
            },
          },
        });
      } catch (err) {
        toast({ status: "error", title: "failed to update the speaker name." });
      }
    },
    [baseUpdateName, data]
  );

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
              userCanEdit={data?.interview?.currentUserCanEdit}
              updateName={updateName}
            />
          ))
        )}
        {groups && (
          <Highlights
            activeTagIds={activeTagIds}
            interviewId={interviewId}
            groups={groups}
            onlySuggestedHighlights={highlightMode === "suggested"}
          />
        )}
        {groups && highlightMode === "suggested" && (
          <SuggestedHighlights interviewId={interviewId} groups={groups} />
        )}
        <SelectionPrompt
          groups={groups}
          interviewId={interviewId}
          selectionContainerRef={scrollContainerRef}
        />
        <ActiveWord scrollContainerRef={scrollContainerRef} groups={groups} />
      </Flex>
      <ContinueTrackingPrompt scrollContainerRef={scrollContainerRef} />
    </Box>
  );
};
