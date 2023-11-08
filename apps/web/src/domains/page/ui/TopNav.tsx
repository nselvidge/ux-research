import { Flex, Heading, Spacer, Box, Button } from "@chakra-ui/react";
import React, { ReactElement, ReactNode } from "react";
import { Link, useLocation } from "wouter";

import { useMeQuery } from "../requests/page.generated";
import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import { FaPlus } from "react-icons/fa";

const TopNavItem = ({
  children,
  isActive,
  path,
  variant,
  leftIcon,
}: {
  children: ReactNode;
  path: string;
  isActive: boolean;
  variant?: "inverted";
  leftIcon?: ReactElement;
}) => (
  <Button
    margin="0px 4px"
    variant={variant === "inverted" ? "brandInverted" : "brand"}
    href={path}
    isActive={isActive}
    as={Link}
    display={{ base: "none", md: "flex" }}
    leftIcon={leftIcon}
  >
    {children}
  </Button>
);

export const TopNav = () => {
  useLocation();
  const { data } = useMeQuery();
  const me = data?.me;
  return (
    <Flex
      padding="14px 16px 30px"
      borderBottom="1px #E0E0E0 solid"
      justifyContent="center"
      background="#317358"
      alignItems="center"
    >
      <Heading
        color="#FAF1EB"
        fontSize="20px"
        fontWeight="700"
        marginRight="8px"
      >
        RESONATE
      </Heading>
      {me && (
        <>
          <TopNavItem path="/" isActive={window.location.pathname === "/"}>
            All Interviews
          </TopNavItem>
          <TopNavItem
            path="/projects"
            isActive={window.location.pathname === "/projects"}
          >
            Projects
          </TopNavItem>
        </>
      )}
      {me ? (
        <>
          <TopNavItem
            path="/workspace/members"
            isActive={/workspace/.test(window.location.pathname)}
          >
            Manage
          </TopNavItem>
          <Spacer />
          <TopNavItem
            variant="inverted"
            path="/import"
            isActive={window.location.pathname === "/import"}
            leftIcon={<FaPlus color="#317358" />}
          >
            Import Interview
          </TopNavItem>
        </>
      ) : (
        <Spacer />
      )}
      <Box paddingRight="15px" display={{ base: "none", md: "flex" }}>
        {me ? (
          <AccountMenu me={me} />
        ) : (
          <TopNavItem
            variant="inverted"
            path="/login"
            isActive={window.location.pathname === "/login"}
          >
            Log In
          </TopNavItem>
        )}
      </Box>
      <MobileNav />
    </Flex>
  );
};
