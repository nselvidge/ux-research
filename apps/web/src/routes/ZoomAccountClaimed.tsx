import React from "react";
import { Flex, Link, Text } from "@chakra-ui/react";
import { useTrackOnce } from "~/domains/analytics/tracker";

export const ZoomAccountClaimedRoute = () => {
  useTrackOnce("Screen Viewed", { screen: "Zoom Account Claimed" });
  return (
    <Flex
      height="100%"
      width="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Text maxWidth="350px">
        Zoom account is already claimed. <Link href="/logout">logout</Link> of
        your current account and log in with your Zoom account to continue.
      </Text>
    </Flex>
  );
};
