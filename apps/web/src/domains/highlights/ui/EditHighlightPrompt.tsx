import {
  Button,
  Flex,
  Spacer,
  Text,
  Spinner,
  useToast,
  CircularProgress,
  Portal,
} from "@chakra-ui/react";
import React, { useCallback, useMemo, useState } from "react";
import { prop } from "remeda";
import { trackEvent } from "~/domains/analytics/tracker";
import {
  InterviewHighlightsDocument,
  useInterviewHighlightsQuery,
} from "~/domains/interview/requests/interviews.generated";
import { useTranscriptMode } from "~/domains/interview/state/transcriptMode";
import { TagInputModal } from "~/domains/tags/ui/TagInputModal";
import { Tag, TagSelect } from "~/domains/tags/ui/TagSelect";
import { TagColor } from "~/global/generated/graphql";
import {
  InterviewWorkspaceDocument,
  useAddHighlightToTranscriptMutation,
  useAddNewTagMutation,
  useAddTagsMutation,
  useRemoveTagsMutation,
} from "../requests/highlights.generated";
import { useCurrentEditingHighlight } from "../state/editHighlight";
import { useNewHighlight } from "../state/newHighlight";
import { useInterviewTags } from "../state/tagColorState";
import { RemoveHighlightButton } from "./RemoveHighlightButton";

export interface Highlight {
  id?: string;
  tags: { id: string; name: string; color: TagColor; emoji: string }[];
  highlightedRange: {
    text: string;
    startWord: {
      id: string;
      wordNumber: number;
      groupNumber: number;
      start: number;
      end: number;
    };
    endWord: {
      id: string;
      wordNumber: number;
      groupNumber: number;
      start: number;
      end: number;
    };
  };
  originSuggestionId?: string | null;
}

const useAddHighlight = ({ interviewId }: { interviewId: string }) => {
  const toast = useToast();
  const { setCurrentHighlight } = useCurrentEditingHighlight();
  const { clearNewHighlight } = useNewHighlight();
  const [baseAddHighlight, { loading }] = useAddHighlightToTranscriptMutation();
  const { addTag, setMode, transcriptMode } = useTranscriptMode();
  const { loading: interviewLoading, refetch } = useInterviewHighlightsQuery({
    variables: { id: interviewId },
    skip: true,
  });

  const addHighlight = async (newHighlight: Highlight) => {
    const { startWord, endWord } = newHighlight.highlightedRange;
    try {
      const result = await baseAddHighlight({
        variables: {
          interviewId,
          startWord: {
            wordNumber: startWord.wordNumber,
            groupNumber: startWord.groupNumber,
          },
          endWord: {
            wordNumber: endWord.wordNumber,
            groupNumber: endWord.groupNumber,
          },
          tagIds: newHighlight.tags.map(({ id }) => id),
        },
      });
      await refetch();
      setCurrentHighlight(result.data?.addHighlight?.id || "", true);
      clearNewHighlight();
      if (newHighlight.tags.length > 0 && transcriptMode.mode !== "full") {
        addTag(newHighlight.tags[0].id);
      } else {
        setMode("full");
      }
      trackEvent("Highlight Created", {
        source: "Transcript",
      });
      return result.data?.addHighlight?.id;
    } catch (e) {
      toast({
        status: "error",
        title: "Failed to create highlight, please try again later",
      });
    }
  };
  return { addHighlight, loading: loading || interviewLoading };
};

export const EditHighlightPrompt = ({
  interviewId,
  currentHighlight,
}: {
  interviewId: string;
  currentHighlight: Highlight;
}) => {
  const { stopEditing, clearEditingHighlight } = useCurrentEditingHighlight();
  const { setTags, clearNewHighlight } = useNewHighlight();
  const toast = useToast();

  const [inputValue, setInputValue] = useState("");

  const tags = useInterviewTags(interviewId) || [];

  const { addHighlight, loading: loadingAddHighlight } = useAddHighlight({
    interviewId,
  });
  const [baseAddTags, { loading: addTagsLoading }] = useAddTagsMutation();
  const [baseRemoveTags, { loading: removeTagsLoading }] =
    useRemoveTagsMutation();

  const [addNewTag, { loading: addNewTagLoading }] = useAddNewTagMutation({
    refetchQueries: [
      { query: InterviewHighlightsDocument, variables: { id: interviewId } },
    ],
  });

  const addTags = async (highlightId: string, tagIds: string[]) => {
    if (tagIds.length === 0) {
      return;
    }
    const newTags = tagIds.map((currentId) =>
      tags.find(({ id }) => id === currentId)
    );
    await baseAddTags({
      variables: { interviewId, highlightId, tagIds },
      optimisticResponse: {
        addTagsToHighlight: {
          __typename: "Highlight",
          id: highlightId,
          tags: currentHighlight.tags
            .concat(newTags)
            .map((tag) => ({ ...tag, __typename: "Tag" })),
        },
      },
    });
  };

  const removeTags = async (highlightId: string, tagIds: string[]) => {
    if (tagIds.length === 0 || !currentHighlight.id) {
      return;
    }
    await baseRemoveTags({
      variables: { interviewId, highlightId, tagIds },
      optimisticResponse: {
        removeTagsFromHighlight: {
          __typename: "Highlight",
          id: highlightId,
          tags: currentHighlight.tags.filter(({ id }) => !tagIds.includes(id)),
        },
      },
    });
  };

  const onTagChange = async (newTags: Tag[]) => {
    let currentHighlightId = currentHighlight.id;
    if (!currentHighlightId) {
      setTags(newTags);
      const id = await addHighlight(currentHighlight);
      if (!id) {
        toast({
          status: "error",
          title: "Error adding highlight, please try again later",
        });
        return;
      }
      currentHighlightId = id;
    }

    const currentTagIds = currentHighlight.tags.map(prop("id"));
    const newTagIds = newTags.map(prop("id"));

    const tagIdsToAdd = newTagIds.filter((id) => !currentTagIds.includes(id));
    const tagIdsToRemove = currentTagIds.filter(
      (id) => !newTagIds.includes(id)
    );

    await Promise.all([
      addTags(currentHighlightId, tagIdsToAdd),
      removeTags(currentHighlightId, tagIdsToRemove),
    ]);
    trackEvent("Highlight Tags Updated", {
      highlightId: currentHighlightId,
      interviewId,
    });
  };

  const [tagCreateState, setTagCreateState] = useState({
    currentHighlightId: null,
    currentTagName: "",
    isOpen: false,
  });

  const onCreateTag = useCallback(
    async (tagName: string) => {
      let currentHighlightId = currentHighlight.id;
      if (!currentHighlightId) {
        const id = await addHighlight(currentHighlight);
        if (!id) {
          toast({
            status: "error",
            title: "Error adding highlight, please try again later",
          });
          return;
        }
        currentHighlightId = id;
      }
      setTagCreateState({
        currentHighlightId,
        currentTagName: tagName,
        isOpen: true,
      });
    },
    [currentHighlight]
  );

  const onTagCreateDone = async (
    name: string,
    color: TagColor,
    emoji: string
  ) => {
    await addNewTag({
      variables: {
        tagName: name,
        tagColor: color,
        tagEmoji: emoji,
        interviewId: interviewId,
        highlightId: tagCreateState.currentHighlightId,
      },
      refetchQueries: [
        { query: InterviewWorkspaceDocument, variables: { id: interviewId } },
      ],
      optimisticResponse: {
        addNewTagToHighlight: {
          __typename: "Highlight",
          id: tagCreateState.currentHighlightId,
          tags: currentHighlight.tags
            .concat({
              name,
              id: "temp",
              color,
              emoji,
            })
            .map((tag) => ({ ...tag, __typename: "Tag" })),
        },
      },
    });
    setTagCreateState({ ...tagCreateState, currentTagName: "", isOpen: false });
  };

  const currentTags: Tag[] = useMemo(
    () =>
      currentHighlight?.tags?.map((tag) => ({
        ...tag,
        color: tag.id === "temp" ? ("gray" as TagColor) : tag.color,
      })) || [],
    [currentHighlight]
  );

  const onDone = async () => {
    if (!currentHighlight.id) {
      await addHighlight(currentHighlight);
    }
    stopEditing();
  };

  return (
    <Flex
      direction="column"
      padding="16px"
      background="white"
      borderRadius="12px"
    >
      {tagCreateState.isOpen && (
        <Portal>
          <TagInputModal
            isOpen={tagCreateState.isOpen}
            onClose={() =>
              setTagCreateState({
                ...tagCreateState,
                isOpen: false,
                currentTagName: "",
              })
            }
            onDone={onTagCreateDone}
            headerText="Create New Tag"
            defaultName={tagCreateState.currentTagName}
            loading={addNewTagLoading}
          />
        </Portal>
      )}
      <Flex marginBottom="8px" alignItems="center">
        <Text variant="bodyBold">
          {currentHighlight?.id ? "Edit Highlight" : "Add Highlight"}
        </Text>
        {addTagsLoading || removeTagsLoading || addNewTagLoading ? (
          <Spinner
            color="brand.500"
            aria-label="saving changes"
            size="sm"
            marginLeft="4px"
          />
        ) : null}
        <Spacer />
        <RemoveHighlightButton
          interviewId={interviewId}
          highlightId={currentHighlight?.id}
          onRemove={() => {
            clearEditingHighlight();
            clearNewHighlight();
          }}
        />
      </Flex>
      <TagSelect
        value={currentTags}
        onChange={onTagChange}
        inputValue={inputValue}
        onCreateTag={onCreateTag}
        onInputChange={setInputValue}
        options={tags}
      />
      {inputValue.length < 1 && (
        <Button onClick={onDone} variant="brand">
          {currentHighlight?.id ? "Done" : "Capture highlight"}
        </Button>
      )}
      <Flex
        background="white"
        zIndex={10}
        opacity="0.5"
        width="100%"
        height="100%"
        position="absolute"
        left="0px"
        top="0px"
        display={loadingAddHighlight ? "flex" : "none"}
        alignItems="center"
        justifyContent="center"
        borderRadius="12px"
      >
        <CircularProgress isIndeterminate color="brand.500" />
      </Flex>
    </Flex>
  );
};
