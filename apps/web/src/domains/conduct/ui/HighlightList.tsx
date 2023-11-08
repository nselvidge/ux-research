import { Flex } from "@chakra-ui/react";
import React from "react";
import { HighlightCard } from "./HighlightCard";

export const HighlightList = ({
  highlights,
}: {
  highlights: { id: string; timestamp: number }[];
}) => {
  return (
    <Flex overflowY="auto" direction="column" width="100%">
      {highlights.map(({ id, timestamp }) => (
        <HighlightCard timestamp={timestamp} key={id} />
      ))}
    </Flex>
  );
};
