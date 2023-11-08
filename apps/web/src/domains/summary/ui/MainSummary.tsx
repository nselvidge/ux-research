import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import {
  Button,
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableTextarea,
  useEditableControls,
  forwardRef,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { flatMap, groupBy, mapValues, pipe } from "remeda";
import { trackEvent } from "~/domains/analytics/tracker";
import { HighlightTag } from "~/domains/tags/ui/HighlightTag";
import { PlayerContextProvider } from "~/domains/videoPlayer/state/playerContext";
import { VideoPlayer } from "~/domains/videoPlayer/ui/VideoPlayer";
import { useUpdateSummaryMutation } from "../requests/summary.generated";
import { convertNameToId } from "./TagSummary";
import TextareaAutosize from "react-textarea-autosize";

export interface MainSummaryProps {
  interviewId: string;
  summary: {
    id: string;
    text: string;
  };
  recording: {
    url: string;
    previewImageUrl: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
  highlights: {
    tags: {
      id: string;
    }[];
  }[];
}

const SummaryEditButton = () => {
  const {
    isEditing,
    getEditButtonProps,
    getSubmitButtonProps,
    getCancelButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup>
      <Button leftIcon={<FaSave />} {...getSubmitButtonProps} variant="brand">
        Save
      </Button>
      <Button
        leftIcon={<CloseIcon />}
        {...getCancelButtonProps}
        variant="brandMono"
      >
        Cancel
      </Button>
    </ButtonGroup>
  ) : (
    <ButtonGroup>
      <Button
        aria-label="edit"
        leftIcon={<FaEdit />}
        {...getEditButtonProps()}
        variant="brandMono"
      >
        Edit
      </Button>
    </ButtonGroup>
  );
};

const ResizableEditableTextArea = forwardRef((_, ref) => (
  <EditableTextarea
    minH="unset"
    overflow="hidden"
    w="100%"
    resize="none"
    marginBottom="8px"
    as={TextareaAutosize}
    ref={ref}
  />
));

export const MainSummary = ({
  recording,
  tags,
  highlights,
  summary,
  interviewId,
}: MainSummaryProps) => {
  const [baseUpdateSummary] = useUpdateSummaryMutation({});

  const updateSummary = async (rawText: string) => {
    const text = rawText.trim();
    await baseUpdateSummary({
      variables: {
        interviewId,
        text,
      },
      optimisticResponse: {
        updateInterviewSummary: {
          __typename: "Interview",
          id: interviewId,
          summary: {
            __typename: "InterviewSummary",
            id: summary.id,
            text,
          },
        },
      },
    });
    trackEvent("Summary Edited", {
      interviewId,
    });
  };

  const tagCounts = useMemo(
    () =>
      pipe(
        highlights,
        flatMap(({ tags }) => tags),
        groupBy(({ id }) => id),
        mapValues((tags) => tags.length)
      ),
    [highlights]
  );

  const taglessHighlightCount = useMemo(
    () => highlights.filter(({ tags }) => tags.length === 0).length,
    [highlights]
  );

  return (
    <Flex direction="column" flexGrow={0} width="100%" alignItems="left">
      <Editable
        defaultValue={summary?.text}
        onSubmit={(nextValue) => updateSummary(nextValue)}
        selectAllOnFocus={false}
      >
        <Flex justifyContent="space-between" width="100%">
          <Heading variant="largeTitleBold" marginBottom="18px">
            Summary
          </Heading>
          <Box>
            <SummaryEditButton />
          </Box>
        </Flex>
        <Flex marginBottom="16px" wrap="wrap">
          {[...tags]
            .filter((tag) => tagCounts[tag.id] > 0)
            .sort((a, b) => (tagCounts[b.id] || 0) - (tagCounts[a.id] || 0))
            .map((tag) => (
              <HighlightTag
                key={tag.id}
                id={tag.id}
                name={tag.name}
                highlightCount={tagCounts[tag.id] || 0}
                variant="outline"
                onClick={() => {
                  const elem = document.getElementById(
                    convertNameToId(tag.name)
                  );
                  elem?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            ))}
          {taglessHighlightCount > 0 && (
            <HighlightTag
              id="other-highlights"
              name="Other Highlights"
              highlightCount={taglessHighlightCount}
              variant="outline"
              onClick={() => {
                const elem = document.getElementById("other-highlights");
                elem?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )}
        </Flex>
        <Box marginBottom={summary?.text ? "16px" : "0px"}>
          <EditablePreview whiteSpace={"pre-line"} as="p" />
          <ResizableEditableTextArea />
        </Box>
        <PlayerContextProvider>
          <Flex flexGrow={0} maxHeight="450px">
            <VideoPlayer
              previewImageUrl={recording.previewImageUrl}
              url={recording.url}
            />
          </Flex>
        </PlayerContextProvider>
      </Editable>
    </Flex>
  );
};
