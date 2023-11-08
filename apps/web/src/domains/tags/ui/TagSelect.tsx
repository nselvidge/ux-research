import { Box, Button, Tag, TagLabel, Text } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import { TagColor } from "~/global/generated/graphql";
import {
  CreatableSelect,
  chakraComponents,
  SelectComponentsConfig,
  GroupBase,
} from "chakra-react-select";
import { Emoji, EmojiStyle } from "emoji-picker-react";

interface OptionType {
  label: string;
  value: string;
  colorScheme: TagColor;
  emoji: string;
  isNewOption?: boolean;
}

export interface Tag {
  name: string;
  id: string;
  color: TagColor;
  emoji: string;
}

interface TagSelectProps {
  onCreateTag: (name: string) => void;
  onChange: (selectedTags: Tag[]) => void;
  onInputChange: (newTag: string) => void;
  options: Tag[];
  value: Tag[];
  inputValue: string;
  isLoading?: boolean;
}

const createOptionFromTag = ({ id, name, color, emoji }: Tag) => ({
  label: name,
  value: id,
  colorScheme: color,
  emoji,
});

const createTagFromOption = ({
  label,
  value,
  colorScheme,
  emoji,
}: OptionType) => ({
  id: value,
  name: label,
  color: colorScheme,
  emoji,
});

const customComponents: SelectComponentsConfig<
  OptionType,
  true,
  GroupBase<OptionType>
> = {
  Option: ({ children, data, ...props }) => {
    return (
      <chakraComponents.Option data={data} {...props}>
        {data.isNewOption ? (
          <Button width="100%" variant="brand">
            {children}
          </Button>
        ) : (
          <Tag
            colorScheme={data.colorScheme}
            paddingInlineStart="12px"
            paddingInlineEnd="12px"
            paddingTop="8px"
            paddingBottom="8px"
            margin="4px"
          >
            <Emoji
              emojiStyle={EmojiStyle.NATIVE}
              size={16}
              unified={data.emoji}
            />
            <TagLabel
              marginLeft="4px"
              fontWeight="700"
              fontSize="14px"
              color="#000"
            >
              {children}
            </TagLabel>
          </Tag>
        )}
      </chakraComponents.Option>
    );
  },

  MultiValueContainer: ({ children, data }) => (
    <Tag
      paddingInlineStart="12px"
      paddingInlineEnd="12px"
      paddingTop="8px"
      paddingBottom="8px"
      colorScheme={data.colorScheme}
      margin="4px"
    >
      <Emoji size={16} unified={data.emoji} />
      {children}
    </Tag>
  ),

  MultiValueLabel: ({ children, data }) => {
    return (
      <Text marginLeft="4px" fontWeight="700" fontSize="14px" color="#000">
        {children}
      </Text>
    );
  },

  Input: ({ children, ...props }) => (
    <chakraComponents.Input {...props} aria-label="tag name input">
      {children}
    </chakraComponents.Input>
  ),
};

export const TagSelect = ({
  onCreateTag,
  onChange,
  options,
  value,
  inputValue,
  onInputChange,
}: TagSelectProps) => {
  const innerValue = useMemo(() => value.map(createOptionFromTag), [value]);
  const innerOptions = useMemo(
    () => options.map(createOptionFromTag),
    [options]
  );

  const innerOnChange = useCallback(
    (options: OptionType[]) => {
      onChange(options.map(createTagFromOption));
    },
    [onChange]
  );

  const innerOnCreateOption = useCallback(
    (name: string) => {
      onCreateTag(name);
    },
    [onChange, onCreateTag]
  );

  return (
    <Box position="relative">
      <CreatableSelect
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            margin: "0px 0px",
            maxWidth: "100%",
            width: "350px",
          }),
          menu: (provided) => ({
            ...provided,
            position: "relative",
            display: "block",
            border: "none",
            padding: "0px",
            margin: "0px",
          }),
          menuList: (provided) => {
            return {
              ...provided,
              border: "none",
              boxShadow: "none",
              padding: "0px",
              margin: "8px 0px",
            };
          },
          option: (provided, state) => {
            const isNewOption = (state.data as OptionType).isNewOption;
            return {
              ...provided,
              margin: isNewOption ? "8px 0px 8px" : "0px",
              padding: "0px",
              background: isNewOption ? "none" : provided.background,
            };
          },
          noOptionsMessage: () => ({ display: "none" }),
          dropdownIndicator: () => ({ display: "none" }),
        }}
        components={customComponents}
        onChange={innerOnChange}
        onInputChange={onInputChange}
        inputValue={inputValue}
        placeholder="Add a tag"
        isMulti
        value={innerValue}
        options={innerOptions}
        menuIsOpen
        onCreateOption={innerOnCreateOption}
        getNewOptionData={(value, label) => ({
          value,
          label: label as string,
          isNewOption: true,
          colorScheme: "gray" as TagColor,
          emoji: "1f642",
        })}
      />
    </Box>
  );
};
