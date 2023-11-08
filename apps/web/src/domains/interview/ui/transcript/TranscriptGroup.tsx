import React, { MouseEvent, useCallback, useRef, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";

import { TranscriptGroupData } from "../../state/parsedTranscript";
import { FaCheck, FaUserAlt } from "react-icons/fa";
import { makeSearchWordByCoordinates } from "../../utils/searchWordByCoordinates";

export const TranscriptGroup = ({
  group,
  seekTo,
  userCanEdit,
  updateName,
}: {
  group: TranscriptGroupData;
  isInterviewer: boolean;
  seekTo: (time: number) => void;
  userCanEdit: boolean;
  updateName: (speakerId: string, newName: string) => Promise<unknown>;
}) => {
  const [inputVal, setInputVal] = useState(group.speaker.name);
  const ref = useRef(null);
  const textRef = useRef(null);

  const search = makeSearchWordByCoordinates();

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const word = search(group.words, e.clientX, e.clientY);
      if (!word) {
        return;
      }

      seekTo(word.start);
    },
    [seekTo, group]
  );

  return (
    <Flex
      ref={ref}
      width="100%"
      data-group-number={group.groupNumber}
      className="groupParent"
      paddingBottom="24px"
    >
      <Flex
        borderRadius="20px"
        height="24px"
        width="24px"
        backgroundColor="rgba(49, 115, 88, 0.2);"
        justifyContent="center"
        alignItems="center"
        flexShrink={0}
      >
        <FaUserAlt color="#317358" size="10px" />{" "}
      </Flex>
      <Box paddingLeft="8px" flexGrow={1}>
        {userCanEdit ? (
          <Popover>
            <PopoverTrigger>
              <Text
                color="#000"
                fontWeight={700}
                cursor="pointer"
                as="span"
                userSelect="none"
                variant="bodyBold"
              >
                {group.speaker.name}:{" "}
              </Text>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverBody padding="30px 15px 15px">
                  <form
                    onSubmit={() => updateName(group.speaker.id, inputVal)}
                    style={{ marginBottom: "0px" }}
                  >
                    <FormControl>
                      <Flex>
                        <IconButton
                          icon={<FaCheck />}
                          aria-label="save"
                          marginRight="5px"
                          onClick={() => {
                            updateName(group.speaker.id, inputVal);
                          }}
                        />
                        <Input
                          defaultValue={group.speaker.name}
                          onChange={(e) => setInputVal(e.target.value)}
                          flexGrow={1}
                        />
                      </Flex>
                    </FormControl>
                  </form>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ) : (
          <Text
            userSelect="none"
            as="span"
            color="#000"
            fontWeight={700}
            variant="bodyBold"
          >
            {group.speaker.name}:{" "}
          </Text>
        )}
        <Text
          color="#000"
          as="span"
          className="groupContainer"
          data-group-number={group.groupNumber}
          onClick={handleClick}
          ref={textRef}
          position="relative"
          zIndex={2}
          variant="body"
          _selection={{
            background: "#E1E1E1",
            height: "24px",
          }}
        >
          {group.text}
        </Text>
      </Box>
    </Flex>
  );
};
