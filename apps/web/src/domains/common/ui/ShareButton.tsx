import { Button, useToast } from "@chakra-ui/react";
import React, { MouseEvent } from "react";
import { FaLink } from "react-icons/fa";
import { trackEvent } from "~/domains/analytics/tracker";

interface ShareButtonProps {
  shareLink: string;
  padding?: string;
  variant?: "brand" | "brandInverted" | "brandMono" | "link" | "altLink";
  children?: React.ReactNode;
  withIcon?: boolean;
  sharedEntityName: string;
  sharedEntityId: string;
}

export const ShareButton = ({
  shareLink,
  padding,
  variant,
  children,
  withIcon,
  sharedEntityName,
  sharedEntityId,
}: ShareButtonProps) => {
  const toast = useToast();
  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareLink);
    toast({ status: "success", title: "Copied link to clipboard" });
    trackEvent("Share Button Clicked", { sharedEntityName, sharedEntityId });
  };

  return (
    <Button
      onClick={onClick}
      leftIcon={withIcon && <FaLink />}
      variant={variant}
      padding={padding}
    >
      {children}
    </Button>
  );
};
