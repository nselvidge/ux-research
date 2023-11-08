import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { Link } from "wouter";
import React from "react";
import { FaPlus } from "react-icons/fa";

export const EmptyInterviewList = () => {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <Spacer flexGrow={1} />
      <Box>
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          style={{ height: "48px", width: "48px" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          color="#317358"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
      </Box>
      <Heading marginTop="8px" variant="title">
        No Interviews
      </Heading>
      <Text variant="caption">Get started by importing a new interview</Text>
      <Box marginTop="24px">
        <Button
          as={Link}
          href="/import"
          leftIcon={<FaPlus aria-hidden="true" />}
          variant="brand"
        >
          Import Interview
        </Button>
      </Box>
      <Spacer flexGrow={2} />
    </Flex>
  );
};
