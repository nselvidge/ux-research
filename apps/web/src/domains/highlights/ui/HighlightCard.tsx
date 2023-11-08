import { Flex, Spacer, Text } from "@chakra-ui/layout";
import { Img } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

export const HighlightCard = ({
  interviewDate,
  transcript,
  coverImageUrl,
  coverGifUrl,
  onClick,
}: {
  coverImageUrl: string;
  coverGifUrl: string;
  interviewDate: number;
  transcript: { groups?: { text: string }[] };
  onClick: () => void;
}) => {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const listener = () => {
      setWidth(ref.current?.getBoundingClientRect()?.width || 320);
    };
    if (ref) {
      setWidth(ref.current?.getBoundingClientRect()?.width || 320);
      window.addEventListener("resize", listener);
    }
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [ref]);
  return (
    <Flex
      background="#fff"
      direction="column"
      shrink={0}
      grow={0}
      border="1px solid #D6D6D6"
      borderRadius="16px"
      overflow="hidden"
      cursor="pointer"
      boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"
      _hover={{
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Flex
        bg="rgba(49, 115, 88, 0.2)"
        justifyContent="center"
        alignItems="center"
        position="relative"
        ref={ref}
        height={`${width ? (180 / 320) * width : 180}px`}
      >
        <Flex
          display={hover ? "flex" : "none"}
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Img width="100%" src={coverGifUrl} />
        </Flex>
        <Flex
          display={!hover ? "flex" : "none"}
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Img width="100%" src={coverImageUrl} />
        </Flex>
      </Flex>
      <Flex flexGrow={1} direction="column" padding="16px">
        <Text variant="body" marginBottom="16px" noOfLines={4}>
          "{transcript.groups.map((group) => group.text)}"
        </Text>
        <Spacer />
        <Text variant="body" color="gray.700">
          {formatDistanceToNow(interviewDate)} ago
        </Text>
      </Flex>
    </Flex>
  );
};
