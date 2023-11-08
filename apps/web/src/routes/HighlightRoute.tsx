import { Flex, Spacer } from "@chakra-ui/layout";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { ClipPlayer } from "~/domains/interview/ui/ClipPlayer";
import { SingleHighlightTranscriptViewer } from "~/domains/interview/ui/SingleHighlightTranscriptViewer";
import { Template } from "~/domains/page/ui/Template";
import { PlayerContextProvider } from "~/domains/videoPlayer/state/playerContext";

export const HighlightRoute: React.FC<{ id: string }> = ({ id }) => {
  useTrackOnce("Screen Viewed", {
    screen: "Single Highlight",
    highlightId: id,
  });
  return (
    <Template limitHeight cream>
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
            <SingleHighlightTranscriptViewer highlightId={id} />
          </Flex>
          <Flex
            width="65%"
            grow={1}
            direction="column"
            paddingRight="20px"
            maxHeight="100%"
          >
            <ClipPlayer highlightId={id} />
          </Flex>
        </Flex>
      </PlayerContextProvider>
    </Template>
  );
};
