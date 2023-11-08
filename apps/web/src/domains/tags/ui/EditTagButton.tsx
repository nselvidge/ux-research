import { Button, useDisclosure } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { TagColor } from "~/global/generated/graphql";
import {
  useUpdateTagNameMutation,
  useUpdateTagColorMutation,
  useUpdateTagEmojiMutation,
} from "../requests/tags.generated";
import { TagInputModal } from "./TagInputModal";

export const EditTagButton = ({
  id,
  name,
  color,
  emoji,
}: {
  id: string;
  name: string;
  color: TagColor;
  emoji: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [baseUpdateName, { loading: tagNameLoading }] =
    useUpdateTagNameMutation();
  const [baseUpdateColor, { loading: tagColorLoading }] =
    useUpdateTagColorMutation();
  const [baseUpdateEmoji, { loading: tagEmojiLoading }] =
    useUpdateTagEmojiMutation();

  const updateName = useCallback(
    (newName: string) => {
      return baseUpdateName({
        variables: {
          tagId: id,
          name: newName,
        },
        optimisticResponse: {
          updateTagName: {
            __typename: "Tag",
            id,
            name: newName,
          },
        },
      });
    },
    [id, name]
  );
  const updateColor = useCallback(
    (newColor: TagColor) => {
      return baseUpdateColor({
        variables: {
          tagId: id,
          color: newColor,
        },
        optimisticResponse: {
          updateTagColor: {
            __typename: "Tag",
            id,
            color: newColor,
          },
        },
      });
    },
    [id, color]
  );
  const updateEmoji = useCallback(
    (newEmoji: string) => {
      return baseUpdateEmoji({
        variables: {
          tagId: id,
          emoji: newEmoji,
        },
        optimisticResponse: {
          updateTagEmoji: {
            __typename: "Tag",
            id,
            emoji: newEmoji,
          },
        },
      });
    },
    [id, emoji]
  );

  const onDone = (newName: string, newColor: TagColor, newEmoji: string) => {
    Promise.all([
      updateName(newName),
      updateColor(newColor),
      updateEmoji(newEmoji),
    ]).then(() => onClose());
  };

  return (
    <>
      <Button variant="altLink" onClick={onOpen}>
        Edit
      </Button>
      <TagInputModal
        isOpen={isOpen}
        onClose={onClose}
        onDone={onDone}
        loading={tagNameLoading || tagColorLoading || tagEmojiLoading}
        headerText="Edit Tag"
        defaultName={name}
        defaultColor={color}
        defaultEmoji={emoji}
      />
    </>
  );
};
