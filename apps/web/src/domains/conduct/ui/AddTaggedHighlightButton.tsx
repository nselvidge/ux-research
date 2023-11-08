import { Button, Tag } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { TagColor } from "~/global/generated/graphql";

export const HighlightButton = ({
  children,
  color,
  onClick,
  count,
}: {
  children: ReactNode;
  color: TagColor | "gray";
  onClick: () => void;
  count?: number;
}) => {
  return (
    <Button
      onClick={onClick}
      background={`${color}.50`}
      _hover={{ backgroundColor: `${color}.300` }}
      _selected={{ backgroundColor: `${color}.400` }}
      _active={{ backgroundColor: `${color}.400` }}
      _focus={{ backgroundColor: `${color}.100` }}
      margin="4px"
      flexShrink={0}
      flexWrap="wrap"
      padding="8px"
      height="auto"
      minHeight="48px"
      flexGrow={1}
    >
      {children}{" "}
      {count > 0 && (
        <Tag
          marginLeft="4px"
          backgroundColor={`${color}.500`}
          color="white"
          padding="4px 16px"
          borderRadius={"24px"}
          flexShrink={0}
        >
          {count}
        </Tag>
      )}
    </Button>
  );
};
