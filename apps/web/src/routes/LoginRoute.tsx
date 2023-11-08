import { Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { Login } from "~/domains/auth/ui/Login";

export const LoginRoute = () => {
  useTrackOnce("Screen Viewed", { screen: "Login" });
  return (
    <Flex
      height="100%"
      width="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="cream.300"
    >
      <Login />
    </Flex>
  );
};
