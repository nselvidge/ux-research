import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useKeyboardShortcut } from "~/domains/common/state/keyboardShortcuts";
import { TagColor } from "~/global/generated/graphql";
import { useCreateTimestampHighlightMutation } from "../requests/conduct.generated";
import { HighlightButton } from "./AddTaggedHighlightButton";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { DragHandleIcon } from "@chakra-ui/icons";
import { AllTagsDragDropContext } from "./AllTagsDragDrop";
import { Emoji, EmojiStyle } from "emoji-picker-react";

type TagType = { id: string; name: string; color: TagColor; emoji: string };

const AllTagsButtonList = ({
  tags,
  highlights,
  onCreateHighlight,
}: {
  tags: TagType[];
  highlights: { tags?: { id: string }[] }[];
  onCreateHighlight: (timestamp: number, tagId: string) => void;
}) => {
  const [isHovering, setIsHovering] = useState<null | number>(null);

  return (
    <AllTagsDragDropContext tags={tags}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {tags.map((tag, index) => (
              <Draggable
                key={tag.id}
                draggableId={tag.id}
                index={index}
                disableInteractiveElementBlocking
              >
                {(provided) => (
                  <Flex
                    width="100%"
                    flexGrow={1}
                    alignItems="center"
                    justifyContent="stretch"
                    paddingLeft={isHovering === index ? "21px" : "0px"}
                    transition="padding-left 0.2s"
                    ref={provided.innerRef}
                    position="relative"
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                  >
                    <DragHandleIcon
                      opacity={isHovering === index ? 1 : 0}
                      onMouseOver={() => setIsHovering(index)}
                      onMouseLeave={() =>
                        setIsHovering((i) => (i === index ? null : i))
                      }
                      transition="opacity 0.2s"
                      position="absolute"
                      left="6px"
                      height="100%"
                      zIndex={1}
                    />
                    <HighlightButton
                      key={tag.id}
                      onClick={() => onCreateHighlight(Date.now(), tag.id)}
                      color={tag.color}
                      count={
                        highlights.filter(
                          (highlight) =>
                            !!highlight.tags?.find(({ id }) => tag.id === id)
                        ).length
                      }
                    >
                      <Emoji
                        emojiStyle={EmojiStyle.NATIVE}
                        unified={tag.emoji}
                        size={16}
                      />
                      <Text as="span" marginLeft="6px">
                        {tag.name}
                      </Text>
                    </HighlightButton>
                  </Flex>
                )}
              </Draggable>
            ))}
          </Box>
        )}
      </Droppable>
    </AllTagsDragDropContext>
  );
};

const ProjectTagsButtonList = ({
  highlights,
  onCreateHighlight,
  projectTags,
}: {
  highlights: { tags?: { id: string }[] }[];
  onCreateHighlight: (timestamp: number, tagId: string) => void;
  projectTags: TagType[];
}) => {
  return (
    <Box>
      {projectTags.map((tag) => (
        <Flex
          width="100%"
          flexGrow={1}
          alignItems="center"
          justifyContent="stretch"
          position="relative"
        >
          <HighlightButton
            key={tag.id}
            onClick={() => onCreateHighlight(Date.now(), tag.id)}
            color={tag.color}
            count={
              highlights.filter(
                (highlight) => !!highlight.tags?.find(({ id }) => tag.id === id)
              ).length
            }
          >
            <Emoji
              emojiStyle={EmojiStyle.NATIVE}
              unified={tag.emoji}
              size={16}
            />
            <Text as="span" marginLeft="6px">
              {tag.name}
            </Text>
          </HighlightButton>
        </Flex>
      ))}
    </Box>
  );
};

export const TaggedHighlightButtonList = ({
  tags,
  highlights,
  interviewId,
  projectTags,
}: {
  tags: TagType[];
  highlights: { tags?: { id: string }[] }[];
  interviewId: string;
  projectTags: TagType[];
}) => {
  const [createHighlight] = useCreateTimestampHighlightMutation();
  const onCreateHighlight = useCallback(
    async (timestamp: number, tagId?: string) => {
      createHighlight({ variables: { interviewId, timestamp, tagId } });
    },
    [interviewId, highlights, tags]
  );

  useKeyboardShortcut("command+s,ctrl+s", () => onCreateHighlight(Date.now()));

  return (
    <Flex
      direction="column"
      alignItems="stretch"
      width="100%"
      height="100%"
      flexGrow={1}
      background="white"
      border="1px solid #E9DCC9"
      padding="16px"
      borderRadius="16px"
      overflow="auto"
    >
      <Box>
        <Flex
          width="100%"
          flexGrow={1}
          alignItems="stretch"
          justifyContent="stretch"
        >
          <HighlightButton
            onClick={() => onCreateHighlight(Date.now())}
            color={"gray"}
            count={
              highlights.filter((highlight) => highlight.tags.length === 0)
                .length
            }
          >
            <Emoji emojiStyle={EmojiStyle.NATIVE} unified="26a1" size={16} />
            <Text as="span" marginLeft="6px">
              Highlight
            </Text>
          </HighlightButton>
        </Flex>
      </Box>

      {projectTags.length > 0 ? (
        <ProjectTagsButtonList
          highlights={highlights}
          onCreateHighlight={onCreateHighlight}
          projectTags={projectTags}
        />
      ) : (
        <AllTagsButtonList
          tags={tags}
          highlights={highlights}
          onCreateHighlight={onCreateHighlight}
        />
      )}
    </Flex>
  );
};
