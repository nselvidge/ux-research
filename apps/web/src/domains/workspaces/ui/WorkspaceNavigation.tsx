import { Box, Button, Flex, Icon, Spacer, Text } from "@chakra-ui/react";
import { useLocation } from "wouter";
import React, { ReactNode } from "react";
import { FaAngleRight, FaCog } from "react-icons/fa";

const MenuButton = ({
  children,
  onClick,
  isActive,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      _active={{ background: "gray.50" }}
      _hover={{ background: "gray.300" }}
      background="white"
      isActive={isActive}
      width="100%"
      padding="8px 16px"
      borderRadius="0px"
    >
      <Icon marginRight="16px" as={FaCog} />
      {children}
      <Spacer />
      <Icon as={FaAngleRight} />
    </Button>
  );
};

export const WorkspaceNavigationContent = ({
  children,
}: {
  children: ReactNode;
}) => (
  <Box
    background="white"
    flexShrink={1}
    height="100%"
    width=" 100%"
    borderRadius="16px"
    marginLeft="16px"
    padding="16px"
    boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"
  >
    {children}
  </Box>
);

export const WorkspaceNavigation = () => {
  const [, navigate] = useLocation();
  return (
    <Flex
      background="white"
      boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"
      direction="column"
      alignItems="stretch"
      height="100%"
      width="360px"
      borderRadius="16px"
    >
      <Text padding="24px 16px 8px" variant="largeBodyBold">
        Manage
      </Text>
      <MenuButton
        isActive={/members/.test(window.location.pathname)}
        onClick={() => navigate("/workspace/members")}
      >
        Users
      </MenuButton>
      <MenuButton
        isActive={/tags/.test(window.location.pathname)}
        onClick={() => navigate("/workspace/tags")}
      >
        Tags
      </MenuButton>
      <MenuButton
        isActive={/user-preferences/.test(window.location.pathname)}
        onClick={() => navigate("/workspace/user-preferences")}
      >
        User Preferences
      </MenuButton>
    </Flex>
  );
};
