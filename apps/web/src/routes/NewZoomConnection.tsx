import { Flex } from "@chakra-ui/react";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { ZoomAuth } from "~/domains/auth/ui/ZoomAuth";

export const NewZoomConnection = () => {
  useTrackOnce("Screen Viewed", { screen: "New Zoom Connection" });
  return (
    <Flex
      height="100%"
      width="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <ZoomAuth />
    </Flex>
  );
};
