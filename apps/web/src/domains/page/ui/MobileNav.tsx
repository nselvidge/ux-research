import {
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "wouter";
import React, { ReactNode, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const MobileNavItem = ({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) => (
  <Button variant="ghost" margin="10px" as={Link} href={path}>
    {children}
  </Button>
);

export const MobileNav = () => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <IconButton
        icon={isOpen ? <FaTimes /> : <FaBars />}
        aria-label={isOpen ? "close menu" : "open menu"}
        onClick={onToggle}
        variant="link"
        color="cream.300"
        _hover={{ color: "cream.500" }}
        _active={{ color: "cream.500" }}
        display={{ base: "inline-block", md: "none" }}
      />
      <Drawer onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent padding="30px 10px 10px">
          <DrawerCloseButton />
          <MobileNavItem path="/">All Interviews</MobileNavItem>
          <MobileNavItem path="/projects">Projects</MobileNavItem>
          <MobileNavItem path="/workspace/members">Manage</MobileNavItem>
          <MobileNavItem path="/import">Import Interview</MobileNavItem>
          <Button as={ChakraLink} href="/logout">
            Logout
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};
