import { Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";
import { FaUserAlt } from "react-icons/fa";

export const HighlightCard = ({ timestamp }: { timestamp: number }) => {
  return (
    <Flex
      background="white"
      width="100%"
      padding="12px 16px"
      borderRadius="12px"
      border="1px solid #E9DCC9"
      marginBottom="8px"
    >
      <Flex
        borderRadius="20px"
        overflow="hidden"
        background="rgba(49, 115, 88, 0.2);"
        flexShrink={0}
        height="40px"
        width="40px"
        justifyContent="center"
        alignItems="center"
      >
        <FaUserAlt color="brand.500" size="16px" />
      </Flex>
      <Flex paddingLeft="8px">
        <Text variant="body">
          Captured a 15 second highlight at {format(timestamp, "pp")}
        </Text>
      </Flex>
    </Flex>
  );
};
