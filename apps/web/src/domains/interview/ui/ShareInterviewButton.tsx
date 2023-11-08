import { Button, useToast } from "@chakra-ui/react";
import React from "react";
import { FaLink } from "react-icons/fa";
import { trackEvent } from "~/domains/analytics/tracker";

export const ShareInterviewButton = ({ id }: { id: string }) => {
  const toast = useToast();
  const onClick = () => {
    navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}/interview/${id}`
    );
    toast({ status: "success", title: "Copied Interview link to clipboard" });
    trackEvent("Share Button Clicked", {
      sharedEntityName: "Interview",
      sharedEntityId: id,
    });
  };

  return (
    <Button
      aria-label="copy share link"
      onClick={onClick}
      leftIcon={<FaLink />}
      variant="brandInverted"
    >
      Share
    </Button>
  );
};
