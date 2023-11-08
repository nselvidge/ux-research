import { inject, injectable } from "tsyringe";
import {
  addProjectTag,
  moveTagToPosition,
  removeProjectTag,
  updateProjectTagPositions,
  updateProject,
} from "../entities/Project";
import { addProjectToWorkspace } from "../../auth/entities/Workspace";
import { AdminInteractor } from "../../auth/interactors/Admin";
import {
  deserializeProject,
  PersistenceProject,
  serializeProject,
} from "./serializers/SerializedProject";
import {
  deserializeWorkspace,
  PersistenceWorkspace,
  serializeWorkspace,
} from "../../auth/interactors/serializers/SerializedWorkspace";
import { deserializeTag } from "./serializers/SerializedTag";
import { InteractorRepositories } from "./InteractorRepositories";


@injectable()
export class ProjectManagerInteractor {
  constructor(
    @inject("Repositories") private repositories: InteractorRepositories,
    private admin: AdminInteractor
  ) {}

  ensureUserCanViewProject = async (projectId: string, userId: string) => {
    const workspace = await this.repositories.workspaces
      .getWorkspaceByProjectId(projectId)
      .then(deserializeWorkspace);

    return this.admin.ensureUserCanEditWorkspace(userId, workspace.id);
  };

  getProjectById = async (projectId: string): Promise<PersistenceProject> =>
    this.repositories.projects.getProjectById(projectId);

  getWorkspaceByProjectId = async (
    projectId: string
  ): Promise<PersistenceWorkspace> => {
    const workspace = await this.repositories.workspaces
      .getWorkspaceByProjectId(projectId)
      .then(deserializeWorkspace);

    return serializeWorkspace(workspace);
  };

  createProject = async (
    workspaceId: string,
    name: string,
    description: string
  ): Promise<PersistenceProject> => {
    const workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    const { workspace: updatedWorkspace, newProject } = addProjectToWorkspace(
      workspace,
      name,
      description
    );

    await this.repositories.projects.createProject(
      updatedWorkspace.id,
      newProject
    );

    return serializeProject(newProject);
  };

  updateProject = async (
    projectId: string,
    { name, description }: { name?: string; description?: string }
  ) => {
    const project = await this.repositories.projects.getProjectById(projectId);

    const updatedProject = updateProject(project, { name, description });

    await this.repositories.projects.updateProject(projectId, updatedProject);

    return serializeProject(updatedProject);
  };

  addProjectTagToProject = async (
    projectId: string,
    tagId: string
  ): Promise<PersistenceProject> => {
    const project = await this.repositories.projects
      .getProjectById(projectId)
      .then(deserializeProject);

    const tagData = await this.repositories.tags
      .getTagsForWorkspace(project.workspaceId)
      .then((tags) => tags.find((tag) => tag.id === tagId));

    if (!tagData) {
      throw new Error(
        `Tag ${tagId} not found in workspace ${project.workspaceId}`
      );
    }

    const tag = deserializeTag(tagData);

    const { project: updatedProject, projectTag } = addProjectTag(
      project,
      tag
    );

    await this.repositories.projects.addProjectTagToProject(
      projectId,
      projectTag
    );

    // Move the new tag to the first position

    const projectWithUpdatedPositions = moveTagToPosition(
      updatedProject,
      projectTag.tagId,
      0
    );

    await this.repositories.projects.updateProjectTagPositions(
      projectId,
      projectWithUpdatedPositions.projectTags
    );

    return serializeProject(projectWithUpdatedPositions);
  };

  removeProjectTagFromProject = async (
    projectId: string,
    tagId: string
  ): Promise<PersistenceProject> => {
    const project = await this.repositories.projects
      .getProjectById(projectId)
      .then(deserializeProject);

    const { project: updatedProject } = removeProjectTag(project, tagId);

    await this.repositories.projects.removeProjectTagFromProject(
      projectId,
      updatedProject.projectTags,
      tagId
    );

    return serializeProject(updatedProject);
  };

  updateProjectTagPositions = async (
    projectId: string,
    projectTagIds: string[]
  ): Promise<PersistenceProject> => {
    let project = await this.repositories.projects
      .getProjectById(projectId)
      .then(deserializeProject);

    const projectTags = projectTagIds.map((tagId, index) => ({
      tagId,
      position: index,
    }));

    project = updateProjectTagPositions(project, projectTags);

    await this.repositories.projects.updateProjectTagPositions(
      projectId,
      project.projectTags
    );

    return serializeProject(project);
  };
}
