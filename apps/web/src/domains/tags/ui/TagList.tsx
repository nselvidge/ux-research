import { Flex } from "@chakra-ui/react";
import React from "react";
import { TagColor } from "~/global/generated/graphql";
import { HighlightTag } from "./HighlightTag";

export const TagList = ({
  tags,
}: {
  tags: { name: string; id: string; color: TagColor; emoji: string }[];
}) => (
  <Flex wrap="wrap">
    {tags.map(({ name, id, color, emoji }) => (
      <HighlightTag key={id} id={id} name={name} color={color} emoji={emoji} />
    ))}
  </Flex>
);
