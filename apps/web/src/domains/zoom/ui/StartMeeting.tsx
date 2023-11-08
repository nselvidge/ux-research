import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useZoomClient } from "../requests/zoom";

export const StartMeeting = () => {
  const { zoom } = useZoomClient();
  return (
    <Flex
      direction="column"
      maxWidth="650px"
      textAlign="center"
      paddingTop="50px"
      alignItems="center"
    >
      <Heading marginBottom="10px" variant="largeTitleBold">
        Join a meeting to get started
      </Heading>
      <Text maxWidth="400px" variant="body" marginBottom="15px">
        Join a meeting and start the Resonate app to record an interview and
        capture highlights.
      </Text>
      <Flex justifyContent="center">
        <Button variant="brand" onClick={() => zoom.launchAppInMeeting()}>
          Create a new meeting
        </Button>
      </Flex>
    </Flex>
  );
};
