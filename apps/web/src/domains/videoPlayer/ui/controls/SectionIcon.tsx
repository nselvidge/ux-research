import { Box } from "@chakra-ui/react";
import React from "react";

export const SectionIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <Box
      width="4px"
      height="16px"
      boxSizing="content-box"
      marginTop={isActive ? "-10px" : "-8px"}
      marginLeft={isActive ? "-3px" : "-2px"}
      bgColor={isActive ? "white" : "#F2994A"}
      borderRadius={isActive ? "4px" : "2px"}
      border={isActive ? "#F2994A 2px solid" : "none"}
    />
  );
};
