import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useCurrentWorkspace } from "~/domains/workspaces/state/currentWorkspace";
import { TagColor } from "~/global/generated/graphql";
import { useUpdateUserTagOrderMutation } from "../requests/conduct.generated";

type TagType = { id: string; name: string; color: TagColor; emoji: string };

const reorder = (
  list: TagType[],
  startIndex: number,
  endIndex: number
): TagType[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const AllTagsDragDropContext = ({
  tags,
  children,
}: {
  tags: TagType[];
  children: React.ReactNode;
}) => {
  const { currentWorkspace: workspaceId } = useCurrentWorkspace();
  const [updateTagOrder] = useUpdateUserTagOrderMutation();
  return (
    <DragDropContext
      onDragEnd={(result: {
        source: { index: number };
        destination?: { index: number };
        draggableId: string;
      }) => {
        if (!result.destination || !result.source) {
          return;
        }

        const newTags = reorder(
          tags,
          result.source.index,
          result.destination.index
        );

        updateTagOrder({
          variables: {
            tagIds: newTags.map(({ id }) => id),
            workspaceId,
          },
          optimisticResponse: {
            updateUserTagOrder: {
              __typename: "Workspace",
              id: workspaceId,
              tags: newTags.map((tag) => ({
                __typename: "Tag",
                id: tag.id,
                name: tag.name,
                isDefault: false,
                color: tag.color,
                emoji: tag.emoji,
              })),
            },
          },
        });
      }}
    >
      {children}
    </DragDropContext>
  );
};
