import { Flex } from "@chakra-ui/layout";
import React from "react";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useRedirectIfNotLoggedIn } from "~/domains/page/state/redirectIfNotLoggedIn";
import { Template } from "~/domains/page/ui/Template";
import { VideoUpload } from "~/domains/upload/ui/VideoUpload";

export const UploadRoute = () => {
  useRedirectIfNotLoggedIn();
  useTrackOnce("Screen Viewed", { screen: "Upload" });
  return (
    <Template cream>
      <Flex
        minWidth="100%"
        minHeight="100%"
        justifyContent="center"
        alignItems="start"
        padding="24px"
      >
        <VideoUpload />
      </Flex>
    </Template>
  );
};
