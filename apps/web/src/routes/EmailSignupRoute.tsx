import { Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { Signup } from "~/domains/auth/ui/Signup";

export const EmailSignupRoute = () => {
  useTrackOnce("Screen Viewed", {
    screen: "Email Signup",
  });
  return (
    <Flex width="100%" direction="column" alignItems="center" height="100%">
      <Flex marginTop="200px" alignItems="center" justifyContent="center">
        <Signup />
      </Flex>
    </Flex>
  );
};
