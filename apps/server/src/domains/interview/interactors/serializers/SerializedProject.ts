import { ProjectTag, Project } from "../../entities/Project";
import { deserializeTag, PersistenceTag, serializeTag } from "./SerializedTag";

export interface PersistenceProjectTag {
    tagId: string;
    projectId: string;
    position: number;
    tag: PersistenceTag;
}

export interface PersistenceProject {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  projectTags: PersistenceProjectTag[];
  workspaceId: string;
}

export const serializeProjectTag = (projectTag: ProjectTag): PersistenceProjectTag => ({
  tagId: projectTag.tagId,
  projectId: projectTag.projectId,
  position: projectTag.position,
  tag: serializeTag(projectTag.tag),
});

export const deserializeProjectTag = (projectTag: PersistenceProjectTag): ProjectTag => ({
  tagId: projectTag.tagId,
  projectId: projectTag.projectId,
  position: projectTag.position,
  tag: deserializeTag(projectTag.tag),
});


export const serializeProject = (project: Project): PersistenceProject => ({
  id: project.id,
  name: project.name,
  description: project.description,
  createdAt: project.createdAt,
  projectTags: project.projectTags.map(serializeProjectTag),
  workspaceId: project.workspaceId,
});

export const deserializeProject = (project: PersistenceProject): Project => ({
  id: project.id,
  name: project.name,
  description: project.description,
  createdAt: project.createdAt,
  projectTags: project.projectTags.map(deserializeProjectTag),
  workspaceId: project.workspaceId,
});
