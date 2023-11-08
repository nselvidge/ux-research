import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Skeleton,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  useInterviewQuery,
  useUpdateInterviewNameMutation,
} from "../requests/interviews.generated";
import { useMeQuery } from "~/domains/page/requests/page.generated";
import { format } from "date-fns";
import { FaChevronLeft, FaPen, FaVideo } from "react-icons/fa";
import { Link } from "wouter";
import { ShareInterviewButton } from "./ShareInterviewButton";
import { TopNavItem } from "~/domains/page/ui/TopNavItem";
import { InterviewOptionsMenu } from "./InterviewOptionsMenu";

interface InterviewHeadingProps {
  interviewId: string;
}

const isSummaryReady = (interview?: {
  recording?: { previewImageUrl?: string };
  transcript?: { isPending?: boolean };
}) => {
  return (
    interview?.recording?.previewImageUrl !== undefined &&
    !interview?.transcript?.isPending
  );
};

export const InterviewHeading = ({ interviewId }: InterviewHeadingProps) => {
  const toast = useToast();
  const { data, loading } = useInterviewQuery({
    variables: { id: interviewId },
  });

  const { data: currentUser } = useMeQuery();
  const [updateInterviewName] = useUpdateInterviewNameMutation();

  return (
    <Flex
      background="brand.500"
      width="100%"
      justifyContent="left"
      alignItems="center"
      flexShrink={0}
      height="76px"
      padding="0 16px 16px"
    >
      <Flex justifyContent="left" alignItems="center">
        {currentUser?.me && (
          <IconButton
            aria-label="back to all interviews"
            as={Link}
            href={
              data?.interview?.projectId
                ? `/project/${data?.interview?.projectId}`
                : "/"
            }
            variant="link"
            color="white"
            icon={<FaChevronLeft />}
          />
        )}

        <VStack alignItems="left" spacing={0}>
          {loading ? (
            <Skeleton width="300px" height="40px" />
          ) : (
            <>
              <Text as={"div"} variant="bodyBold" color="white">
                <Editable
                  isDisabled={!data?.interview?.currentUserCanEdit}
                  onSubmit={async (nextName: string) => {
                    await updateInterviewName({
                      variables: { id: data?.interview?.id, name: nextName },
                    });
                    toast({
                      title: "Successfully updated your interview",
                      status: "success",
                    });
                  }}
                  maxWidth="650px"
                  defaultValue={data?.interview?.name}
                  display="inline-block"
                >
                  <EditablePreview padding="0px" />
                  <EditableInput padding="0px" />
                </Editable>{" "}
              </Text>
              {data?.interview?.date && (
                <Text color="#F5F5F5" opacity="0.7" variant="caption">
                  {format(data?.interview?.date, "PPPP")}
                </Text>
              )}
            </>
          )}
        </VStack>
      </Flex>
      <Spacer />
      <Flex>
        <TopNavItem
          isActive={window.location.pathname === `/interview/${interviewId}`}
          path={`/interview/${interviewId}`}
          leftIcon={<FaVideo />}
        >
          Video & Transcript
        </TopNavItem>
        <TopNavItem
          isActive={
            window.location.pathname === `/interview/${interviewId}/summary`
          }
          path={`/interview/${interviewId}/summary`}
          leftIcon={<FaPen />}
          isDisabled={!isSummaryReady(data?.interview)}
          tooltip={
            !isSummaryReady(data?.interview)
              ? "Summary is not ready yet"
              : undefined
          }
        >
          Summary
        </TopNavItem>
      </Flex>
      <Spacer />
      <Flex>
        <ShareInterviewButton id={interviewId} />
        <InterviewOptionsMenu interviewId={interviewId} />
      </Flex>
    </Flex>
  );
};
