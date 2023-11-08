import { Flex, Spacer } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { InterviewHeading } from "~/domains/interview/ui/InterviewHeading";
import { RecordingPlayer } from "~/domains/interview/ui/RecordingPlayer";
import { PlayerContextProvider } from "~/domains/videoPlayer/state/playerContext";
import { Template } from "~/domains/page/ui/Template";
import { TranscriptViewer } from "~/domains/interview/ui/TranscriptViewer";
import {
  NextHighlight,
  PreviousHighlight,
} from "~/domains/interview/ui/HighlightControls";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useMinimalInterviewQuery } from "~/domains/interview/requests/interviews.generated";
import { useLocation } from "wouter";

export const InterviewRoute: React.FC<{ id: string }> = ({ id }) => {
  useTrackOnce("Screen Viewed", {
    screen: "Interview",
    interviewId: id,
  });
  const [_, navigate] = useLocation();

  const { data, error } = useMinimalInterviewQuery({ variables: { id } });

  useEffect(() => {
    if (error && error.message === "workspace not found") {
      navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
    }
  }, [error]);

  return (
    <Template limitHeight cream TopNav={<InterviewHeading interviewId={id} />}>
      <PlayerContextProvider>
        <Flex
          id="interview-content"
          flexGrow={1}
          marginBottom="25px"
          width="100%"
          height="100%"
          flexDirection="row-reverse"
        >
          <Flex width="35%" height="100%">
            <TranscriptViewer interviewId={id} />
          </Flex>
          <Flex
            width="65%"
            grow={1}
            direction="column"
            paddingRight="20px"
            maxHeight="100%"
          >
            <RecordingPlayer interviewId={id} />
            <Flex flexShrink={0} paddingTop="12px">
              <PreviousHighlight />
              <Spacer />
              <NextHighlight />
            </Flex>
          </Flex>
        </Flex>
      </PlayerContextProvider>
    </Template>
  );
};
