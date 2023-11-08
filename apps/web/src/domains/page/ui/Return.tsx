import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { Link } from "wouter";
import React, { ReactNode } from "react";

type ReturnProps = {
  children: ReactNode;
  to: string;
};

export const Return = ({ children, to }: ReturnProps) => (
  <Flex>
    <Button
      color="#333333"
      fontSize="14px"
      variant="link"
      marginLeft={"-5px"}
      leftIcon={<ChevronLeftIcon boxSize={"24px"} />}
      href={to}
      as={Link}
    >
      {children}
    </Button>
  </Flex>
);
