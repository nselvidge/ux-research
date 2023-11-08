import { Button, Tooltip } from "@chakra-ui/react";
import React, { ReactElement, ReactNode } from "react";
import { Link } from "wouter";

const ConditionalToopTip = ({
  children,
  tooltip,
}: {
  children: ReactNode;
  tooltip?: string;
}) => {
  if (tooltip) {
    return <Tooltip label={tooltip}>{children}</Tooltip>;
  }
  return <>{children}</>;
};

export const TopNavItem = ({
  children,
  isActive,
  path,
  variant,
  leftIcon,
  isDisabled = false,
  tooltip,
}: {
  children: ReactNode;
  path: string;
  isActive: boolean;
  isDisabled?: boolean;
  variant?: "inverted";
  leftIcon?: ReactElement;
  tooltip?: string;
}) => (
  <ConditionalToopTip tooltip={tooltip}>
    <Button
      margin="0px 4px"
      variant={variant === "inverted" ? "brandInverted" : "brand"}
      href={path}
      isActive={isActive}
      as={Link}
      display={{ base: "none", md: "flex" }}
      leftIcon={leftIcon}
      disabled={isDisabled}
      tooltip={tooltip}
    >
      {children}
    </Button>
  </ConditionalToopTip>
);
