import React, { ReactNode } from "react";
import { Button } from "@chakra-ui/react";
import { Link, useRoute } from "wouter";

type SidebarItemProps = {
  children: ReactNode;
  path: string;
  isActive?: boolean;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  path,
  isActive,
}) => {
  const match = useRoute(path);

  return (
    <Button
      justifyContent="left"
      variant="ghost"
      isActive={isActive || !!match}
      color="#494949"
      fontSize="16px"
      href={path}
      as={Link}
    >
      {children}
    </Button>
  );
};
