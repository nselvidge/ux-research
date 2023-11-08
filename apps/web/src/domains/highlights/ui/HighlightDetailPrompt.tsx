import { Button, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { useInterviewQuery } from "~/domains/interview/requests/interviews.generated";
import { TagList } from "~/domains/tags/ui/TagList";
import { useCurrentEditingHighlight } from "../state/editHighlight";
import { Highlight } from "./EditHighlightPrompt";
import { ShareHighlightButton } from "./ShareHighlightButton";

export const HighlightDetailPrompt = ({
  interviewId,
  currentHighlight,
}: {
  interviewId: string;
  currentHighlight?: Highlight | null;
}) => {
  const { startEditing } = useCurrentEditingHighlight();
  const { data } = useInterviewQuery({ variables: { id: interviewId } });

  if (
    currentHighlight?.tags?.length === 0 &&
    !data?.interview?.currentUserCanEdit
  ) {
    return;
  }

  return (
    <Flex padding="4px" direction="column">
      {currentHighlight?.tags?.length > 0 ? (
        <>
          <Flex padding="4px">
            <Text variant="bodyBold">Tags</Text>
            <Spacer />
            {data?.interview?.currentUserCanEdit && (
              <Button onClick={startEditing} variant="cancelLink">
                Edit
              </Button>
            )}
          </Flex>
          <TagList tags={currentHighlight.tags} />
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
