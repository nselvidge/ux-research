import { Box, Flex } from "@chakra-ui/layout";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TagColor } from "~/global/generated/graphql";
import { useUpdateProjectTagPositionsMutation } from "../requests/projectTags.generated";

const reorder = (
  list: {
    position: number;
    tag: { id: string; name: string; color: TagColor };
  }[],
  startIndex: number,
  endIndex: number
): {
  position: number;
  tag: { id: string; name: string; color: TagColor };
}[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const ProjectTagDragDrop = ({
  projectTags,
  children,
  projectId,
}: {
  projectTags: {
    position: number;
    tag: { id: string; name: string; color: TagColor };
  }[];
  projectId: string;
  children: React.ReactNode;
}) => {
  const [updateProjectTagPositions] = useUpdateProjectTagPositionsMutation();

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
          projectTags,
          result.source.index,
          result.destination.index
        );

        updateProjectTagPositions({
          variables: {
            tagIds: newTags.map(({ tag }) => tag.id),
            projectId,
          },
          optimisticResponse: {
            updateProjectTagPositions: {
              __typename: "Project",
              id: projectId,
              projectTags: newTags.map((projectTag, index) => ({
                __typename: "ProjectTag",
                position: index,
                tag: {
                  __typename: "Tag",
                  id: projectTag.tag.id,
                  name: projectTag.tag.name,
                  isDefault: false,
                  color: projectTag.tag.color,
                },
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

export const DroppableList = ({ children }: { children: React.ReactNode }) => {
  return (
    <Droppable droppableId="reorder-project-tags">
      {(provided) => (
        <Flex
          background="white"
          border="1px solid #E9DCC9"
          borderRadius="16px"
          direction="column"
          padding="16px"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {children}
          {provided.placeholder}
        </Flex>
      )}
    </Droppable>
  );
};

export const DraggableListItem = ({
  children,
  index,
  id,
}: {
  children: React.ReactNode;
  index: number;
  id: string;
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Flex
          width="100%"
          position="relative"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {children}
        </Flex>
      )}
    </Draggable>
  );
};
