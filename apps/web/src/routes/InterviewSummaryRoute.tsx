import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CircularProgress,
  Flex,
  Link,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { InterviewHeading } from "~/domains/interview/ui/InterviewHeading";
import { Template } from "~/domains/page/ui/Template";
import { SummaryHeader } from "~/domains/summary/ui/SummaryHeader";
import { MainSummary } from "~/domains/summary/ui/MainSummary";
import { TagSummaries } from "~/domains/summary/ui/TagSummaries";
import { useInterviewSummaryQuery } from "~/domains/summary/requests/summary.generated";
import { useTrackOnce } from "~/domains/analytics/tracker";
import { useLocation } from "wouter";

const isReadyRecording = (
  recording: unknown
): recording is { url: string; previewImageUrl: string } => {
  return (
    recording !== null &&
    typeof recording === "object" &&
    "url" in recording &&
    "previewImageUrl" in recording
  );
};

export const InterviewSummaryRoute: React.FC<{ id: string }> = ({ id }) => {
  useTrackOnce("Screen Viewed", {
    screen: "Interview Summary",
    interviewId: id,
  });
  const { data, loading, error } = useInterviewSummaryQuery({
    variables: { id },
  });
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (error && error.message === "workspace not found") {
      navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
    }
  }, [error]);

  if (loading) {
    return (
      <Template cream TopNav={<InterviewHeading interviewId={id} />}>
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress isIndeterminate color="brand.500" />
        </Flex>
      </Template>
    );
  }

  if (error) {
    return (
      <Template cream TopNav={<InterviewHeading interviewId={id} />}>
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            maxWidth="md"
            borderRadius="8px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Something went wrong while generating your summary
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please try again later. If the problem persists, please contact us
              at{" "}
              <Link href="mailto:help@resonateapp.com">
                help@resonateapp.com
              </Link>
            </AlertDescription>
          </Alert>{" "}
        </Flex>
      </Template>
    );
  }

  const recording = data?.interview?.recording;

  if (!isReadyRecording(recording)) {
    return (
      <Template cream TopNav={<InterviewHeading interviewId={id} />}>
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            maxWidth="md"
            borderRadius="8px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Interview Processing
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Your interview is being processed. We'll send you an email when
              it's ready.
            </AlertDescription>
          </Alert>{" "}
        </Flex>
      </Template>
    );
  }

  return (
    <Template cream TopNav={<InterviewHeading interviewId={id} />}>
      <Flex direction="column" alignItems="center" width="100%">
        <Flex
          direction="column"
          alignItems="center"
          maxWidth="750px"
          width="100%"
        >
          <SummaryHeader
            name={data?.interview?.name}
            creator={data?.interview?.creator}
          />
          <MainSummary
            interviewId={id}
            recording={recording}
            summary={data?.interview?.summary}
            tags={data?.interview?.workspace?.tags}
            highlights={data?.interview?.highlights}
          />
          <TagSummaries
            tags={data?.interview?.workspace?.tags}
            highlights={data?.interview?.highlights}
          />
        </Flex>
      </Flex>
    </Template>
  );
};
