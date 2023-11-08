import { Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";

import { SignupWithoutEmail } from "~/domains/auth/ui/SignupWithoutEmail";

export const SignupRoute = () => {
  useTrackOnce("Screen Viewed", { screen: "Signup" });
  return (
    <Flex
      backgroundColor="cream.300"
      width="100%"
      direction="column"
      alignItems="center"
      height="100%"
    >
      <Flex marginTop="200px" alignItems="center" justifyContent="center">
        <SignupWithoutEmail />
      </Flex>
    </Flex>
  );
};
