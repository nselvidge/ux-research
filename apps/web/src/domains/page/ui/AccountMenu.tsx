import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Link,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

export const AccountMenu = ({
  me,
}: {
  me: { fullName: string; email: string; id: string };
}) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        variant="link"
        color="cream.300"
        _hover={{ color: "cream.500" }}
        _active={{ color: "cream.500" }}
        icon={<FaUserCircle size="40px" />}
        aria-label="account"
        marginLeft="4px"
      />
      <MenuList zIndex={3}>
        <Text padding="5px 12px">{me.fullName} (you)</Text>
        <MenuDivider />
        <MenuItem as={Link} href="/logout">
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
