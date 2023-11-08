import { ButtonGroup, Flex } from "@chakra-ui/react";
import { useLocation } from "wouter";
import React from "react";
import { ProjectName } from "~/domains/project/ui/ProjectName";
import { SidebarItem } from "./SidebarItem";

export const Sidebar = () => {
  useLocation();
  const path = window.location.pathname;

  return (
    <Flex
      width="250px"
      padding="25px"
      borderRight="1px #E0E0E0 solid"
      direction="column"
    >
      <ProjectName />
      <ButtonGroup flexDirection={"column"} isAttached>
        <SidebarItem path="/" isActive={/(^\/$)|\/interview/.test(path)}>
          Interviews
        </SidebarItem>
        <SidebarItem path="/import">Import</SidebarItem>
        <SidebarItem path="/workspace">Workspace Settings</SidebarItem>
      </ButtonGroup>
    </Flex>
  );
};
