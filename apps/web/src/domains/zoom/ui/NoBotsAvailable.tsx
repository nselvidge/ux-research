import { Box, Flex, Spacer, Text } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/react";
import React, { useEffect } from "react";

export const NoBotsAvailable = ({
  retryRecording,
}: {
  retryRecording: () => void;
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      retryRecording();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [retryRecording]);

  return (
    <Flex
      height="100%"
      backgroundColor="cream.500"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Spacer />
      <Text margin="8px" variant="body" textAlign="center">
        Waiting for a bot to join, this may take a few seconds.
      </Text>
      <CircularProgress
        isIndeterminate
        color="brand.500"
        trackColor="cream.500"
      />
      <Spacer />
    </Flex>
  );
};
