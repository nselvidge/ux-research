import { InternalRefetchQueriesInclude } from "@apollo/client";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import EmojiPicker, { Emoji, EmojiStyle } from "emoji-picker-react";
import React, { useRef, useState } from "react";
import { TagColor } from "~/global/generated/graphql";

const pickRandomTagColor = (): TagColor => {
  const tagColorValues = Object.values(TagColor);
  return tagColorValues[Math.floor(Math.random() * tagColorValues.length)];
};

export const TagInputModal = ({
  isOpen,
  onClose,
  onDone,
  loading,
  headerText,
  defaultName = "",
  defaultColor = pickRandomTagColor(),
  defaultEmoji = "1f642",
}: {
  isOpen: boolean;
  onClose: () => void;
  onDone: (name: string, color: TagColor, emoji: string) => void;
  loading: boolean;
  headerText: string;
  defaultName?: string;
  defaultColor?: TagColor;
  defaultEmoji?: string;
}) => {
  const initialRef = useRef(null);
  const [newName, setNewName] = useState(defaultName);
  const [newColor, setNewColor] = useState(defaultColor);
  const [newEmoji, setNewEmoji] = useState(defaultEmoji);

  const {
    isOpen: isEmojiOpen,
    onToggle: onToggleEmoji,
    onClose: onCloseEmoji,
  } = useDisclosure();

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader padding="16px 16px 4px">
          <Flex>
            <Text variant="bodyBold">{headerText}</Text>
            <Spacer />
            <Button variant="cancelLink" onClick={onClose}>
              Cancel
            </Button>
          </Flex>
        </ModalHeader>
        <ModalBody padding="4px 16px">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onDone(newName, newColor, newEmoji);
            }}
          >
            <FormControl>
              <Flex>
                <Popover isOpen={isEmojiOpen} onClose={onCloseEmoji}>
                  <PopoverTrigger>
                    <Button
                      onClick={onToggleEmoji}
                      borderRadius="12px"
                      flexShrink={0}
                      variant="brandMono"
                      marginRight="4px"
                      height="48px"
                      padding="13px 16px"
                    >
                      <Emoji size={20} unified={newEmoji} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Flex>
                        <EmojiPicker
                          previewConfig={{
                            defaultCaption: "Select an emoji...",
                          }}
                          onEmojiClick={(emoji) => {
                            setNewEmoji(emoji.unified);
                            onCloseEmoji();
                          }}
                        />
                      </Flex>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <Input
                  borderRadius={"16px"}
                  onChange={(e) => setNewName(e.target.value)}
                  ref={initialRef}
                  value={newName}
                  placeholder="Tag name"
                  marginBottom="16px"
                  height="48px"
                />
              </Flex>
              <Flex justifyContent="space-around">
                {Object.values(TagColor).map((color) => (
                  <IconButton
                    key={color}
                    aria-label={`Color ${color}`}
                    icon={
                      color === newColor ? <CheckIcon color="white" /> : <></>
                    }
                    backgroundColor={
                      color === newColor ? `${color}.500` : `${color}.100`
                    }
                    _hover={{ backgroundColor: `${color}.300` }}
                    width="32px"
                    height="32px"
                    minWidth="32px"
                    borderRadius="32px"
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </Flex>
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter padding="4px 16px 16px">
          <Button
            onClick={async () => {
              await onDone(newName, newColor, newEmoji);
            }}
            isLoading={loading}
            variant="brand"
            width="100%"
            aria-label="done editing tag"
          >
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
