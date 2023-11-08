import { Flex, Link, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import React from "react";
import { Link as WouterLink, useLocation } from "wouter";

const SidebarItem = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  const [location] = useLocation();
  return (
    <Button
      backgroundColor={
        location === href ? "rgba(49, 115, 88, 0.10)" : undefined
      }
      color={location === href ? "brand.500" : undefined}
      to={href}
      as={WouterLink}
      variant="ghost"
      marginRight="8px"
      marginBottom="8px"
      flexShrink={1}
    >
      <Text as="span" width="100%" textOverflow="ellipsis" overflow="hidden">
        {children}
      </Text>
    </Button>
  );
};

export const ProjectSidebar = ({ projectId }: { projectId: string }) => {
  return (
    <Flex direction={{ base: "row", lg: "column" }} marginBottom="16px">
      <SidebarItem href={`/project/${projectId}`}>Overview</SidebarItem>
      <SidebarItem href={`/project/${projectId}/tags`}>Manage Tags</SidebarItem>
    </Flex>
  );
};
