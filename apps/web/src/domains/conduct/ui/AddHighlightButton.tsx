import { Button, useToast } from "@chakra-ui/react";
import { FaRegStar } from "react-icons/fa";
import React, { useCallback } from "react";
import { useCreateTimestampHighlightMutation } from "../requests/conduct.generated";
import { useKeyboardShortcut } from "~/domains/common/state/keyboardShortcuts";

interface AddHighlightButtonProps {
  interviewId: string;
}

export const AddHighlightButton = ({
  interviewId,
}: AddHighlightButtonProps) => {
  const [addHighlight] = useCreateTimestampHighlightMutation();
  const toast = useToast();
  const callback = useCallback(async () => {
    await addHighlight({
      variables: { interviewId, timestamp: Date.now() },
    });
  }, [toast, interviewId]);
  useKeyboardShortcut("command+s,ctrl+s", callback);

  return (
    <Button
      flexShrink={0}
      variant="brand"
      width="100%"
      fontSize="20px"
      height="56px"
      onClick={callback}
      leftIcon={<FaRegStar />}
    >
      Capture Highlight
    </Button>
  );
};
