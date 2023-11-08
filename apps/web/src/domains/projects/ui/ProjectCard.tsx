import { Flex, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icons";
import React from "react";
import { FaVideo } from "react-icons/fa";

export interface ProjectCardProps {
  name: string;
  description: string;
  interviewCount: number;
}

export const ProjectCard = ({
  name,
  description,
  interviewCount,
}: ProjectCardProps) => {
  return (
    <Flex
      direction="column"
      padding="16px"
      background="#fff"
      border="1px solid #E9DCC9"
      borderRadius="16px"
      width="100%"
      transition="box-shadow 0.2s ease-in-out"
      boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"
      _hover={{
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
      }}
    >
      <Flex>
        <Spacer />
        <Flex alignItems="center">
          <Icon paddingRight="4px" as={FaVideo} /> {interviewCount}
        </Flex>
      </Flex>
      <Flex direction="column">
        <Heading marginBottom="4px" variant="titleBold">
          {name}
        </Heading>
        <Text variant="body">{description}</Text>
      </Flex>
    </Flex>
  );
};
