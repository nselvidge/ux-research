import { Flex } from "@chakra-ui/react";
import React from "react";
import { TopNav as DefaultTopNav } from "./TopNav";

export const Template: React.FC<{
  children: React.ReactNode;
  limitHeight?: boolean;
  cream?: boolean;
  TopNav?: React.ReactNode;
}> = ({ children, limitHeight, cream, TopNav = <DefaultTopNav /> }) => {
  return (
    <Flex direction="column" height="100%">
      {TopNav}
      <Flex
        grow={1}
        width="100%"
        marginTop="-16px"
        borderRadius="16px 16px 0px 0px"
        background="white"
        justifyContent="center"
        height={limitHeight ? "calc(100% - 60px)" : undefined}
      >
        <Flex
          grow={1}
          width="100%"
          padding="16px"
          borderRadius="16px 16px 0px 0px"
          background={cream ? "cream.300" : "none"}
          height={limitHeight ? "100%" : undefined}
        >
          <Flex
            grow={1}
            width="100%"
            maxWidth={limitHeight ? undefined : "1600px"}
            margin={limitHeight ? undefined : "0px auto"}
            height={limitHeight ? "100%" : undefined}
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
