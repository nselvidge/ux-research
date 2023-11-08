import { Flex, Text } from "@chakra-ui/layout";
import { format } from "date-fns";
import React from "react";
import { HighlightTag } from "~/domains/tags/ui/HighlightTag";
import { TagColor } from "~/global/generated/graphql";

export const SingleHighlightDetails = ({
  interviewName,
  interviewDate,
  tags,
}: {
  interviewName: string;
  interviewDate: number;
  tags: {
    id: string;
    name: string;
    color: TagColor;
  }[];
}) => {
  return (
    <Flex direction="column">
      <Text variant="bodyBold">{interviewName}</Text>
      <Text marginBottom="8px" variant="caption">
        Recorded on {format(interviewDate, "PPPP")}
      </Text>
      <Flex
        marginLeft="-4px"
        marginRight="-4px"
        direction="row"
        flexWrap={"wrap"}
      >
        {tags.map((tag) => (
          <HighlightTag id={tag.id} name={tag.name} color={tag.color} />
        ))}
      </Flex>
    </Flex>
  );
};
