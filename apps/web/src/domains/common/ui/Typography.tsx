import { Heading } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const Title = ({
  bold,
  children,
}: {
  bold: boolean;
  children: ReactNode;
}) => (
  <Heading fontWeight={bold ? 700 : 400} fontSize="24px" lineHeight={1.2}>
    {children}
  </Heading>
);
