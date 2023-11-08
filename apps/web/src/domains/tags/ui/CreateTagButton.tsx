import { InternalRefetchQueriesInclude } from "@apollo/client";
import { Button, useDisclosure } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { useCreateTagMutation } from "~/domains/highlights/requests/highlights.generated";
import { ProjectTagsDocument } from "~/domains/projectTags/requests/projectTags.generated";
import {
  TagHighlightCountsDocument,
  WorkspaceDocument,
} from "~/domains/workspaces/requests/workspace.generated";
import { TagColor } from "~/global/generated/graphql";
import { TagInputModal } from "./TagInputModal";

export const CreateTagButton = ({
  workspaceId,
  projectId = null,
  variant = "brandInverted",
}: {
  workspaceId: string;
  projectId?: string | null;
  variant?: "brandInverted" | "brand";
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const refetchQueries: InternalRefetchQueriesInclude = [
    { query: WorkspaceDocument, variables: { id: workspaceId } },
    { query: TagHighlightCountsDocument, variables: { workspaceId } },
  ];

  if (projectId) {
    refetchQueries.push({
      query: ProjectTagsDocument,
      variables: { projectId },
    });
  }

  const [baseCreateTag, { loading }] = useCreateTagMutation({
    refetchQueries,
  });

  const createTag = useCallback(
    async (newName: string, newColor: TagColor, newEmoji: string) => {
      await baseCreateTag({
        variables: {
          workspaceId,
          projectId,
          name: newName,
          color: newColor,
          emoji: newEmoji,
        },
      });
      onClose();
    },
    [workspaceId]
  );

  return (
    <>
      <Button
        variant={variant}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        leftIcon={
          <FaPlus color={variant === "brandInverted" ? "#317358" : "white"} />
        }
      >
        Create Tag
      </Button>
      <TagInputModal
        headerText="Create Tag"
        isOpen={isOpen}
        onClose={onClose}
        onDone={createTag}
        loading={loading}
      />
    </>
  );
};
