import React from "react";
import { Button } from "@chakra-ui/react";
import { useRemoveHighlightMutation } from "../requests/highlights.generated";

export const RemoveHighlightButton = ({
  interviewId,
  highlightId,
  onRemove,
}: {
  interviewId: string;
  highlightId?: string;
  onRemove: () => void;
}) => {
  const [removeHighlight, { loading: removeHighlightLoading }] =
    useRemoveHighlightMutation({
      variables: { interviewId, highlightId: highlightId },
    });

  return (
    <>
      <Button
        onClick={async () => {
          if (highlightId) {
            await removeHighlight();
          }
          onRemove();
        }}
        isLoading={removeHighlightLoading}
        variant="cancelLink"
      >
        Remove
      </Button>
    </>
  );
};
