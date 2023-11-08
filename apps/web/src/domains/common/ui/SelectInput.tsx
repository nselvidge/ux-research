import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

interface SelectInputProps<T> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  variant?: "brand" | "brandMono";
  width?: string;
}

export const SelectInput = <T extends string | number>({
  options,
  onChange,
  value: currentValue,
  variant = "brand",
  width = "auto",
}: SelectInputProps<T>) => {
  const currentOption = options.find(({ value }) => value === currentValue);
  const withoutCurrent = options.filter(({ value }) => value !== currentValue);

  if (!currentOption) {
    throw new Error("invalid value provided");
  }

  if (withoutCurrent.length === 0) {
    return <Text>{currentOption.label}</Text>;
  }

  return (
    <Menu>
      <MenuButton
        width={width}
        as={Button}
        variant={variant}
        rightIcon={<FaChevronDown />}
      >
        {currentOption.label}
      </MenuButton>
      <MenuList>
        {withoutCurrent.map(({ value, label }) => (
          <MenuItem key={`select-${value}`} onClick={() => onChange(value)}>
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
