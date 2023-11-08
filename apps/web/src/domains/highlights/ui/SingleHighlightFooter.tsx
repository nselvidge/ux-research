import { Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import React from "react";
import { useMeQuery } from "~/domains/page/requests/page.generated";
import { Link } from "wouter";

export const SingleHighlightFooter = ({
  interviewId,
  highlightId,
  highlightCount,
}: {
  interviewId: string;
  highlightId: string;
  highlightCount: number;
}) => {
  const { data, loading } = useMeQuery();
  if (loading) {
    return null;
  }
  return (
    <Flex
      padding="8px 16px"
      borderTop="1px solid #C0C0C0"
      width="100%"
      direction="column"
      alignItems="center"
    >
      {!data?.me ? (
        <>
          <Button
            as={Link}
            href={`/login?redirect=${encodeURIComponent(
              `interview/${interviewId}`
            )}`}
            variant="brand"
            width="100%"
            marginBottom="12px"
          >
            Sign In
          </Button>
          <Text width="100%" variant="caption">
            This interview has {highlightCount} highlights. Sign in with your
            Resonate Account to access them all.
          </Text>
        </>
      ) : (
        <>
          <Button
            as={Link}
            href={`/interview/${interviewId}#highlight-${highlightId}`}
            variant="brand"
            width="100%"
            marginBottom="12px"
          >
            Go to Interview
          </Button>
          <Text width="100%" variant="caption">
            {highlightCount} Highlights on this interview
          </Text>
        </>
      )}
    </Flex>
  );
};
