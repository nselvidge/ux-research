import { Flex, Text, Link as A } from "@chakra-ui/layout";
import React from "react";
import { Link } from "wouter";
import { Emoji, EmojiStyle } from "emoji-picker-react";

export const TagPageCard = ({
  id,
  name,
  highlightCount,
  color,
  projectId,
  emoji,
}: {
  id: string;
  name: string;
  highlightCount: number;
  color: string;
  emoji: string;
  projectId?: string;
}) => {
  return (
    <Link href={projectId ? `/project/${projectId}/tag/${id}` : `/tag/${id}`}>
      <A
        cursor="pointer"
        borderRadius="16px"
        background="white"
        width="100%"
        flexDirection="column"
        overflow="hidden"
        display="flex"
        transition="box-shadow 0.2s ease-in-out"
        boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"
        _hover={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
          textDecoration: "none",
        }}
      >
        <Flex
          background={color}
          height="86px"
          justifyContent="center"
          alignItems="center"
        >
          <Emoji unified={emoji} />
        </Flex>
        <Flex direction="column" padding="12px">
          <Text>{name}</Text>
          <Text>{highlightCount} highlights</Text>
        </Flex>
      </A>
    </Link>
  );
};
