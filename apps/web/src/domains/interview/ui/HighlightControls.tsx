import { Button } from "@chakra-ui/react";
import React from "react";
import { FaStepBackward, FaStepForward } from "react-icons/fa";
import { useSections } from "~/domains/videoPlayer/state/sections";

export const PreviousHighlight = () => {
  const { previousSection } = useSections();
  return (
    <Button
      variant="brandInverted"
      leftIcon={<FaStepBackward />}
      onClick={previousSection}
    >
      Previous Highlight
    </Button>
  );
};

export const NextHighlight = () => {
  const { nextSection } = useSections();
  return (
    <Button
      variant="brandInverted"
      rightIcon={<FaStepForward />}
      onClick={nextSection}
    >
      Next Highlight
    </Button>
  );
};
