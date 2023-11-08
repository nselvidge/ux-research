import {
  Box,
  Button,
  Flex,
  IconButton,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useInterviewHighlightsQuery } from "~/domains/interview/requests/interviews.generated";
import { useTranscriptMode } from "~/domains/interview/state/transcriptMode";
import { HighlightTag } from "~/domains/tags/ui/HighlightTag";
import {
  useApproveSuggestedHighlightMutation,
  useRejectSuggestedHighlightMutation,
} from "../requests/highlights.generated";
import { useCurrentEditingHighlight } from "../state/editHighlight";
import { Highlight } from "./EditHighlightPrompt";
import { ShareHighlightButton } from "./ShareHighlightButton";

export const SuggestedHighlightPrompt = ({
  interviewId,
  currentHighlight,
}: {
  interviewId: string;
  currentHighlight?: Highlight | null;
}) => {
  const { addTag } = useTranscriptMode();
  const { startEditing } = useCurrentEditingHighlight();
  const { data } = useInterviewHighlightsQuery({
    variables: { id: interviewId },
  });
  const [approveSuggestedHighlight, { loading: loadingApproveHighlight }] =
    useApproveSuggestedHighlightMutation({
      variables: { suggestedHighlightId: currentHighlight?.id, interviewId },
      optimisticResponse: {
        __typename: "Mutation",
        approveSuggestedHighlight: {
          __typename: "Interview",
          ...data?.interview,
          highlights: [
            ...(data?.interview?.highlights || []),
            {
              __typename: "Highlight",
              id: currentHighlight?.id,
              originSuggestionId: currentHighlight?.id,
              highlightedRange: currentHighlight?.highlightedRange,
              tags: currentHighlight?.tags?.map((tag) => ({
                __typename: "Tag",
                ...tag,
              })),
            },
          ],
          suggestedHighlights: data?.interview?.suggestedHighlights?.filter(
            (highlight) => highlight.id !== currentHighlight?.id
          ),
        },
      },
    });

  const [rejectSuggestedHighlight, { loading: loadingRejectHighlight }] =
    useRejectSuggestedHighlightMutation({
      variables: { suggestedHighlightId: currentHighlight?.id, interviewId },
      optimisticResponse: {
        __typename: "Mutation",
        rejectSuggestedHighlight: {
          __typename: "Interview",
          ...data?.interview,
          suggestedHighlights: data?.interview?.suggestedHighlights?.filter(
            (highlight) => highlight.id !== currentHighlight?.id
          ),
        },
      },
    });

  if (
    (currentHighlight?.tags?.length === 0 &&
      !data?.interview?.currentUserCanEdit) ||
    !currentHighlight?.id ||
    currentHighlight?.originSuggestionId
  ) {
    return;
  }

  return (
    <Flex padding="4px" direction="column">
      {currentHighlight?.tags?.length > 0 ? (
        <>
          <Flex padding="4px">
            <Text variant="bodyBold">Tags</Text>
          </Flex>
          <Flex marginBottom="2px" padding="0px 4px 4px">
            <Text variant="caption">Suggested</Text>
          </Flex>
          <Flex wrap="wrap">
            {currentHighlight?.tags?.map(({ name, id, color }) => (
              <HighlightTag
                key={id}
                id={id}
                name={name}
                color={color}
                actions={
                  <Box paddingLeft="8px">
                    {loadingRejectHighlight || loadingApproveHighlight ? (
                      <Spinner />
                    ) : (
                      <>
                        <Tooltip label="Reject suggestion" openDelay={1000}>
                          <IconButton
                            _hover={{
                              backgroundColor: "rgba(255,255,255,0.7)",
                            }}
                            variant="ghost"
                            fontSize="20px"
                            padding="2px"
                            size="xs"
                            icon={<FaTimesCircle color="#EB5757" />}
                            aria-label="reject"
                            onClick={async () => {
                              rejectSuggestedHighlight();
                            }}
                          />
                        </Tooltip>
                        <Tooltip label="Accept suggestion" openDelay={1000}>
                          <IconButton
                            _hover={{
                              backgroundColor: "rgba(255,255,255,0.7)",
                            }}
                            variant="ghost"
                            fontSize="20px"
                            padding="2px"
                            size="xs"
                            icon={<FaCheckCircle color="#317358" />}
                            onClick={async () => {
                              approveSuggestedHighlight();
                            }}
                            aria-label="accept"
                          />
                        </Tooltip>
                      </>
                    )}
                  </Box>
                }
              />
            ))}
          </Flex>
          <Flex width="100%" margin="8px 0px">
            <ShareHighlightButton id={currentHighlight.id} />
          </Flex>
        </>
      ) : (
        <>
          <Button margin="4px" onClick={startEditing} variant="brand">
            Edit Highlight
          </Button>
          {currentHighlight && (
            <Flex width="100%" margin="8px 0px">
              <ShareHighlightButton id={currentHighlight.id} />
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};
