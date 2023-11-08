import { Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { Login } from "~/domains/auth/ui/Login";

export const ConnectZoomAccountRoute = () => {
  useTrackOnce("Screen Viewed", {
    screen: "Connect Zoom Account",
  });
  return (
    <Flex
      height="100%"
      width="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Login method="password" />
    </Flex>
  );
};
