import { Button, useToast } from "@chakra-ui/react";
import React, { MouseEvent } from "react";
import { FaLink } from "react-icons/fa";
import { trackEvent } from "~/domains/analytics/tracker";

export const ShareHighlightButton = ({
  id,
  padding,
}: {
  id: string;
  padding?: string;
}) => {
  const toast = useToast();
  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}/highlight/${id}`
    );
    toast({ status: "success", title: "Copied Highlight link to clipboard" });
    trackEvent("Share Button Clicked", {
      sharedEntityName: "Highlight",
      sharedEntityId: id,
    });
  };

  return (
    <Button
      onClick={onClick}
      leftIcon={<FaLink />}
      variant="altLink"
      color="blue.500"
      padding={padding}
    >
      Share highlight
    </Button>
  );
};
