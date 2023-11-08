import React from "react";
import { ListInterviewsQuery } from "../requests/interviews.generated";
import { Box, Grid, Spacer, Link as A, GridItem } from "@chakra-ui/react";
import { InterviewCard } from "./InterviewCard";
import { Link } from "wouter";

export interface InterviewListType {
  id: string;
  name: string;
  date: number;
  highlights: { id: string }[];
  pendingHighlights: { id: string }[];
  creator: {
    fullName: string;
  };
  recording?: {
    previewImageUrl?: string;
    previewGifUrl?: string;
  };
}

export const InterviewList = ({
  interviews,
}: {
  interviews: InterviewListType[];
}) => {
  return (
    <Box margin="auto" width="100%">
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gridGap="16px 16px"
        alignItems="stretch"
      >
        {interviews.map((interview) => (
          <Link href={`/interview/${interview.id}`} key={interview.id}>
            <A
              height="100%"
              alignItems="stretch"
              display="flex"
              _hover={{
                textDecoration: "none",
              }}
            >
              <InterviewCard
                previewImageUrl={interview.recording?.previewImageUrl}
                previewGifUrl={interview.recording?.previewGifUrl}
                name={interview.name}
                creatorName={interview.creator.fullName}
                highlightCount={
                  interview.highlights?.length > 0
                    ? interview.highlights.length
                    : interview.pendingHighlights?.length
                }
                date={interview.date}
              />
            </A>
          </Link>
        ))}
        <Spacer />
      </Grid>
    </Box>
  );
};
