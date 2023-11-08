import React from "react";
import { Box, Button, Link, Skeleton } from "@chakra-ui/react";
import { useIsConnectedToZoomQuery } from "../requests/zoom.generated";
import { ZoomRecordingList } from "./ZoomRecordingList";

export const ConnectWithZoom = () => {
  const { data, loading } = useIsConnectedToZoomQuery();

  if (loading) {
    return <Skeleton width="500px" maxWidth="100%" height="50px" />;
  }

  return data && data.isConnectedToZoom ? (
    <Box>
      <ZoomRecordingList />
    </Box>
  ) : (
    <Button
      as={Link}
      href="/zoom/connect?state=import"
      variant="solid"
      colorScheme="blue"
      isLoading={loading}
      disabled={loading}
    >
      Connect with Zoom
    </Button>
  );
};
