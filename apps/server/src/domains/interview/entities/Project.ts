import { randomUUID } from "crypto";
import { filter, map, pipe, sort } from "remeda";
import { Tag } from "./Tag";

export interface ProjectTag {
  tagId: string;
  tag: Tag;
  projectId: string;
  position: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  projectTags: ProjectTag[];
  workspaceId: string;
}

export const createProject = (
  name: string,
  description: string,
  workspaceId: string
): Project => {
  return {
    id: randomUUID(),
    name,
    description,
    createdAt: new Date(),
    projectTags: [],
    workspaceId,
  };
};

export const updateProject = (
  project: Project,
  { name, description }: { name?: string; description?: string }
): Project => {
  if (name !== undefined && name.length === 0) {
    throw new Error("Project name cannot be empty");
  }

  return {
    ...project,
    name: name ?? project.name,
    description: description ?? project.description,
  };
};

export const addProjectTag = (
  project: Project,
  tag: Tag,
  position: number = project.projectTags.length
) => {
  if (project.workspaceId !== tag.workspaceId) {
    throw new Error(
      `Tag ${tag.id} does not belong to workspace ${project.workspaceId}`
    );
  }

  const projectTag: ProjectTag = {
    tagId: tag.id,
    tag,
    projectId: project.id,
    position,
  };

  const projectTags = [...project.projectTags, projectTag].sort(
    (a, b) => a.position - b.position
  );

  return {
    project: {
      ...project,
      projectTags,
    },
    projectTag,
  };
};

export const removeProjectTag = (project: Project, tagId: string) => {
  const projectTags = pipe(
    project.projectTags,
    filter((projectTag) => projectTag.tagId !== tagId),
    sort((a, b) => a.position - b.position),
    map.indexed((projectTag, index) => ({
      ...projectTag,
      position: index,
    }))
  );

  if (project.projectTags.length === projectTags.length) {
    throw new Error(`Tag with ID ${tagId} not found in project`);
  }

  return {
    project: {
      ...project,
      projectTags,
    },
    removedTagId: tagId,
  };
};

export const updateProjectTagPositions = (
  project: Project,
  newPositions: { tagId: string; position: number }[]
): Project => {
  const projectTags = project.projectTags.map((projectTag) => {
    const newPosition = newPositions.find(
      (newPosition) => newPosition.tagId === projectTag.tagId
    );

    if (newPosition === undefined) {
      throw new Error(
        `New position not provided for tag with ID ${projectTag.tagId}`
      );
    }

    return {
      ...projectTag,
      position: newPosition.position,
    };
  });

  const tagIds = newPositions.map((tag) => tag.tagId);

  const duplicateTagIds = tagIds.filter(
    (tagId, index) => tagIds.indexOf(tagId) !== index
  );
  if (duplicateTagIds.length > 0) {
    throw new Error(
      `Duplicate tag IDs provided: ${duplicateTagIds.join(", ")}`
    );
  }

  const invalidTagIds = newPositions
    .map((newPosition) => newPosition.tagId)
    .filter(
      (tagId) =>
        !project.projectTags.some((projectTag) => projectTag.tagId === tagId)
    );

  if (invalidTagIds.length > 0) {
    throw new Error(`Invalid tag IDs provided: ${invalidTagIds.join(", ")}`);
  }

  projectTags.sort((a, b) => a.position - b.position);

  return {
    ...project,
    projectTags,
  };
};

export const moveTagToPosition = (
  project: Project,
  tagId: string,
  newPosition: number
): Project => {
  const projectTags = [...project.projectTags];
  const tagIndex = projectTags.findIndex(
    (projectTag) => projectTag.tagId === tagId
  );

  if (tagIndex === -1) {
    throw new Error(`Tag with ID ${tagId} not found in project`);
  }

  const tagToMove = projectTags[tagIndex];
  projectTags.splice(tagIndex, 1);
  projectTags.splice(newPosition, 0, tagToMove);

  return {
    ...project,
    projectTags: projectTags.map((projectTag, index) => ({
      ...projectTag,
      position: index,
    })),
  };
};
