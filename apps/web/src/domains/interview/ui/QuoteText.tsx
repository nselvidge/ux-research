import { Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const QuoteText = ({
  children,
  isActive,
}: {
  children: ReactNode;
  isActive?: boolean;
}) => (
  <Text
    fontSize="15px"
    lineHeight="18px"
    color={isActive ? "#494949" : "#828282"}
    fontWeight="400"
    fontStyle="italic"
  >
    {children}
  </Text>
);
