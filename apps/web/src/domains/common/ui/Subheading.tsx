import React, { ReactNode } from "react";
import { Text } from "@chakra-ui/react";

export const Subheading = ({ children }: { children: ReactNode }) => (
  <Text fontSize="14px" color="#909090" marginTop="0px">
    {children}
  </Text>
);
