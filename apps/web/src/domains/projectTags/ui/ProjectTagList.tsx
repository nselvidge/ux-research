import { Flex, Heading, Spacer } from "@chakra-ui/layout";
import { Button, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { indexBy, pipe, sortBy } from "remeda";
import { HighlightTag } from "~/domains/tags/ui/HighlightTag";
import { TagColor } from "~/global/generated/graphql";
import {
  useAddProjectTagMutation,
  useRemoveProjectTagMutation,
} from "../requests/projectTags.generated";
import { EditTagButton } from "~/domains/tags/ui/EditTagButton";
import { EmptyProjectTagList } from "./EmptyProjectTagList";
import {
  DraggableListItem,
  DroppableList,
  ProjectTagDragDrop,
} from "./ProjectTagDragDrop";
import { FaGripVertical } from "react-icons/fa";
import { CreateTagButton } from "~/domains/tags/ui/CreateTagButton";

interface ProjectTagListProps {
  projectId: string;
  projectTags: {
    position: number;
    tag: {
      id: string;
      name: string;
      color: TagColor;
      emoji: string;
      isDefault: boolean;
    };
  }[];
  tags: {
    id: string;
    name: string;
    color: TagColor;
    emoji: string;
    isDefault: boolean;
  }[];
  workspaceId: string;
}

const ProjectTagRow = ({
  id,
  name,
  color,
  projectId,
  emoji,
}: {
  id: string;
  name: string;
  color: TagColor;
  projectId: string;
  emoji: string;
}) => {
  const [removeProjectTag, { loading: loadingRemoveProjectTag }] =
    useRemoveProjectTagMutation();
  return (
    <Flex key={id} alignItems="center" width="100%">
      <Icon as={FaGripVertical} color="#888888" />
      <HighlightTag name={name} color={color} id={id} emoji={emoji} />
      <Spacer />
      <EditTagButton id={id} name={name} color={color} emoji={emoji} />
      <Button
        variant="altLink"
        isLoading={loadingRemoveProjectTag}
        onClick={() =>
          removeProjectTag({
            variables: {
              projectId,
              tagId: id,
            },
          })
        }
      >
        Remove from Project
      </Button>
    </Flex>
  );
};

const OtherTagRow = ({
  id,
  name,
  color,
  projectId,
  emoji,
}: {
  id: string;
  name: string;
  color: TagColor;
  projectId: string;
  emoji: string;
}) => {
  const [addProjectTag, { loading: loadingAddProjectTag }] =
    useAddProjectTagMutation();
  return (
    <Flex key={id} alignItems="center">
      <HighlightTag name={name} color={color} id={id} emoji={emoji} />
      <Spacer />
      <EditTagButton id={id} name={name} color={color} emoji={emoji} />
      <Button
        variant="altLink"
        isLoading={loadingAddProjectTag}
        onClick={() =>
          addProjectTag({
            variables: {
              projectId,
              tagId: id,
            },
          })
        }
      >
        Add to Project
      </Button>
    </Flex>
  );
};

export const ProjectTagList = ({
  projectTags,
  tags,
  projectId,
  workspaceId,
}: ProjectTagListProps) => {
  if (!projectTags) {
    return null;
  }

  const projectTagIdDict = indexBy(
    projectTags,
    (projectTag) => projectTag.tag.id
  );

  const otherTags = tags.filter(
    (tag) => !projectTagIdDict[tag.id]
  ) as typeof tags;

  const sortedProjectTags = pipe(
    projectTags || [],
    sortBy((projectTag) => projectTag.position)
  );

  return (
    <Flex direction="column" width="100%">
      {sortedProjectTags?.length === 0 ? (
        <EmptyProjectTagList />
      ) : (
        <>
          <Flex marginBottom="24px">
            <Flex direction="column" maxWidth="675px">
              <Heading variant="largeTitleBold">Project Tags</Heading>
              <Text variant="body">
                These tags will be included in the Zoom app when a recording is
                made for this project. Tags will be ordered in Zoom based on how
                they're ordered below.
              </Text>
            </Flex>
            <Spacer />
            <CreateTagButton
              variant="brand"
              projectId={projectId}
              workspaceId={workspaceId}
            />
          </Flex>
          <ProjectTagDragDrop
            projectTags={sortedProjectTags}
            projectId={projectId}
          >
            <DroppableList>
              {sortedProjectTags.map((projectTag, index) => (
                <DraggableListItem
                  index={index}
                  id={projectTag.tag.id}
                  key={projectTag.tag.id}
                >
                  <ProjectTagRow
                    key={projectTag.tag.id}
                    id={projectTag.tag.id}
                    name={projectTag.tag.name}
                    color={projectTag.tag.color}
                    emoji={projectTag.tag.emoji}
                    projectId={projectId}
                  />
                </DraggableListItem>
              ))}
            </DroppableList>
          </ProjectTagDragDrop>
        </>
      )}
      <Flex marginTop="48px" marginBottom="24px">
        <Heading variant="largeTitleBold">Other Tags</Heading>
      </Flex>
      <Flex
        direction="column"
        background="white"
        border="1px solid #E9DCC9"
        borderRadius="16px"
        padding="16px"
      >
        {otherTags.map((tag) => (
          <OtherTagRow
            key={tag.id}
            id={tag.id}
            name={tag.name}
            color={tag.color}
            projectId={projectId}
            emoji={tag.emoji}
          />
        ))}
      </Flex>
    </Flex>
  );
};
