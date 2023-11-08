import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { Template } from "~/domains/page/ui/Template";
import { ConnectWithZoom } from "~/domains/import/ui/ConnectWithZoom";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { UploadVideoButton } from "~/domains/upload/ui/UploadVideoButton";
import { useTrackOnce } from "~/domains/analytics/tracker";

export const ImportRoute = () => {
  useRedirectIfNotLoggedIn("import");
  useTrackOnce("Screen Viewed", {
    screen: "Import",
  });
  return (
    <Template cream>
      <Flex flexGrow={1} justifyContent="center">
        <Box width="100%">
          <Flex justifyContent="space-between">
            <Heading marginBottom="25px">Import from Zoom</Heading>
            <UploadVideoButton />
          </Flex>
          <ConnectWithZoom />
        </Box>
      </Flex>
    </Template>
  );
};
