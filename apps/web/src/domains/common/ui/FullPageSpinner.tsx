import { Flex } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/react";
import React from "react";

export const FullPageSpinner = () => {
  return (
    <Flex
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress isIndeterminate color="brand.500" />
    </Flex>
  );
};
