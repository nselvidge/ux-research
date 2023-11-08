import { Button } from "@chakra-ui/react";
import React from "react";

export const StartRecordingButton = ({
  startInterview,
  loading,
}: {
  startInterview: () => void;
  loading: boolean;
}) => {
  return (
    <Button
      isLoading={loading}
      onClick={() => {
        startInterview();
      }}
      variant="brand"
      width="100%"
      fontSize="20px"
      height="68px"
    >
      Record new interview
    </Button>
  );
};
