import React, { useMemo } from "react";
import { Spacer, Text } from "@chakra-ui/react";
import { useActiveSection } from "../../state/sections";

export const SectionLabel = () => {
  const activeSection = useActiveSection();

  return activeSection ? (
    <Text
      noOfLines={1}
      color="#EAEAEA"
      fontWeight="400"
      fontSize="13px"
      flexGrow="1"
    >
      {activeSection.label}
    </Text>
  ) : (
    <Spacer />
  );
};
