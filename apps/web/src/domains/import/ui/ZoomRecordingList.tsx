import { Box, Button, Grid, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import { useGetZoomRecordingListQuery } from "../requests/zoom.generated";
import { ZoomImportCard } from "./ZoomImportCard";

const PAGE_MAX = 20;

export const ZoomRecordingList = () => {
  const { data, loading } = useGetZoomRecordingListQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const recordings = data?.zoomRecordingList?.recordings;
  const total = data?.zoomRecordingList?.totalCount;

  const pageStart = currentPage * PAGE_MAX;
  const pageMax = (currentPage + 1) * PAGE_MAX;
  const pageEnd = Math.min(pageMax, total);

  if (loading) {
    return <Skeleton width="500px" maxWidth="100%" height="50px" />;
  }

  return (
    <Box width="100%">
      <Box marginBottom="15px">
        <Button
          onClick={() => {
            setCurrentPage((page) => page - 1);
          }}
          isDisabled={pageStart === 0}
          marginRight="10px"
        >
          Previous
        </Button>
        {currentPage * PAGE_MAX} - {pageEnd} of {total}
        <Button
          marginLeft="10px"
          onClick={() => {
            setCurrentPage((page) => page + 1);
          }}
          isDisabled={pageEnd === total}
        >
          Next
        </Button>
      </Box>
      <Grid
        templateColumns="repeat(auto-fill, 320px)"
        gridGap="16px 16px"
        alignItems="stretch"
        justifyContent="space-evenly"
      >
        {recordings?.slice(pageStart, pageEnd).map((recording, i) => (
          <ZoomImportCard
            key={recording.externalId + recording.startTime + i}
            externalId={recording.externalId}
            name={recording.label}
            date={new Date(recording.startTime).getTime()}
          />
        ))}
      </Grid>
    </Box>
  );
};
