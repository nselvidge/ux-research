import React from "react";
import { IconButton } from "@chakra-ui/react";
import { FaFastForward } from "react-icons/fa";
import { useSections } from "../../state/sections";

export const NextButton = () => {
  const { nextSection } = useSections();

  return (
    <IconButton
      onClick={nextSection}
      icon={<FaFastForward />}
      aria-label={"next"}
      color="#EAEAEA"
      variant="link"
      padding="6px"
      flexShrink={0}
      minWidth="16px"
    />
  );
};
