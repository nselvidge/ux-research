import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

interface MenuOptionsProps<T extends string | number | null> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  variant?: "white" | "mono";
  menuTitle?: string;
}

export const MenuOptions = <T extends string | number | null>({
  options,
  onChange,
  value: currentValue,
  variant,
  menuTitle,
}: MenuOptionsProps<T>) => {
  const currentOption = options.find(({ value }) => value === currentValue);
  const { isOpen, onClose, onOpen } = useDisclosure();

  if (!currentOption) {
    throw new Error("invalid value provided");
  }
  return (
    <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      <MenuButton
        as={variant === "mono" ? Button : undefined}
        color={variant === "white" ? "white" : undefined}
        variant={variant === "mono" ? "brandMono" : undefined}
      >
        {currentOption.label}
      </MenuButton>
      <MenuList width={variant === "mono" ? undefined : "100px"}>
        <MenuOptionGroup title={menuTitle} value={currentOption.value + ""}>
          {options.map(({ value, label }) => (
            <MenuItemOption
              key={`select-${value}`}
              value={value + ""}
              onClick={() => onChange(value)}
            >
              {label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};
