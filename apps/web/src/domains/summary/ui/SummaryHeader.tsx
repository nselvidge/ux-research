import { Icon } from "@chakra-ui/icon";
import { Flex, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

export interface SummaryHeaderProps {
  name: string;
  creator: {
    fullName: string;
  };
}

export const SummaryHeader = ({ name, creator }: SummaryHeaderProps) => {
  return (
    <Flex
      direction="column"
      width="100%"
      justifyContent="left"
      borderBottom="1px solid"
      borderColor="gray.100"
      paddingBottom="16px"
      marginBottom="16px"
    >
      <Heading variant="largeTitleBold">{name}</Heading>
      <Flex marginTop="8px" alignItems="center">
        <Icon as={FaUserCircle} color="brand.500" marginRight="4px" />{" "}
        <Text variant="body">Host: {creator.fullName}</Text>
      </Flex>
    </Flex>
  );
};
