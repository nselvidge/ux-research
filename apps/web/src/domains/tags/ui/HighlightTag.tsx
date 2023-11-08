import { Tag, TagLabel, Text, Flex } from "@chakra-ui/react";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import React from "react";
import { TagColor } from "~/global/generated/graphql";

export const HighlightTag = ({
  id,
  name,
  color,
  highlightCount,
  margin = "4px",
  variant = "solid",
  onClick,
  actions,
  emoji,
}: {
  id: string;
  name: string;
  color: TagColor;
  emoji: string;
  highlightCount?: number;
  margin?: string;
  variant?: "solid" | "outline";
  onClick?: () => void;
  actions?: React.ReactNode;
}) => (
  <Tag
    flexGrow={0}
    flexShrink={0}
    colorScheme={variant === "solid" ? color : "whiteAlpha"}
    backgroundColor={variant === "outline" ? "white" : undefined}
    paddingInlineStart="12px"
    paddingInlineEnd="12px"
    paddingTop="8px"
    paddingBottom="8px"
    margin={margin}
    cursor={onClick ? "pointer" : "default"}
    onClick={onClick}
  >
    <Flex marginRight="4px" justifyContent="center" alignItems="center">
      <Emoji unified={emoji} size={16} />
    </Flex>
    <TagLabel
      fontWeight={variant === "solid" ? "700" : "500"}
      fontSize="14px"
      color="#000"
    >
      {name}
      {highlightCount !== undefined && (
        <Text
          paddingLeft="4px"
          as="span"
          variant="caption"
          fontWeight={variant === "outline" ? "500" : undefined}
          color={variant === "outline" ? "#000" : undefined}
        >
          {variant === "solid"
            ? `${highlightCount} highlights`
            : `(${highlightCount})`}
        </Text>
      )}
    </TagLabel>
    {actions}
  </Tag>
);
