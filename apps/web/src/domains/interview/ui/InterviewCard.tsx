import React, {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Flex, Img, Spacer, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { last } from "remeda";

export const CardContainer = ({
  cover,
  title,
  date,
  onClick,
  hoverCover,
  highlightCount,
  creatorName,
}: {
  cover?: ReactNode;
  title: string;
  date: number;
  onClick?: MouseEventHandler;
  hoverCover?: ReactNode;
  highlightCount?: number;
  creatorName?: string;
}) => {
  const [hover, setHover] = useState(false);
  const splitName = creatorName?.split(" ");
  const lastInitial =
    splitName && splitName.length > 1 ? " " + last(splitName).charAt(0) : "";
  const adjustedName =
    splitName && splitName.length > 0 ? splitName[0] + lastInitial : false;

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
      width="100%"
      border="1px solid"
      borderWidth="1px"
      borderRadius="16px"
      borderColor="cream.700"
      boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"
      _hover={{
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
      }}
      transition="box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out"
      direction="column"
      overflow="hidden"
      background="white"
      cursor={onClick !== undefined ? "pointer" : undefined}
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
          display={hover && hoverCover ? "flex" : "none"}
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          {hoverCover}
        </Flex>
        <Flex
          display={!hover || !hoverCover ? "flex" : "none"}
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          {cover}
        </Flex>
      </Flex>
      <Flex flexGrow={1} direction="column" padding="16px">
        <Text variant="largeBodyBold"> {title}</Text>
        {highlightCount !== undefined && highlightCount > 0 && (
          <Text variant="body">
            {highlightCount} highlight{highlightCount !== 1 ? "s" : ""}
          </Text>
        )}
        <Spacer minHeight="16px" />
        <Flex>
          <Text color="gray.700" variant="body">
            {formatDistanceToNow(date)} ago
          </Text>
          <Spacer />
          {adjustedName && (
            <Text noOfLines={1} variant="body" color="gray.700">
              by {adjustedName}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const InterviewCard = ({
  name,
  date,
  previewImageUrl,
  previewGifUrl,
  highlightCount,
  creatorName,
}: {
  name: string;
  date: number;
  previewImageUrl?: string;
  previewGifUrl?: string;
  highlightCount: number;
  creatorName: string;
}) => {
  return (
    <CardContainer
      title={name}
      date={date}
      highlightCount={highlightCount}
      creatorName={creatorName}
      cover={
        previewImageUrl ? (
          <Img src={`${previewImageUrl}`} width="100%" />
        ) : undefined
      }
      hoverCover={
        previewGifUrl ? (
          <Img src={`${previewGifUrl}`} width="100%" />
        ) : undefined
      }
    />
  );
};
