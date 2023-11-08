import { Resolvers } from "@root/global/generated/graphql";
import { injectable } from "tsyringe";
import { AdminInteractor } from "../../auth/interactors/Admin";
import { ProjectManagerInteractor } from "../interactors/ProjectManager";

@injectable()
export class ProjectResolver {
  constructor(
    private admin: AdminInteractor,
    private projectManager: ProjectManagerInteractor
  ) {}
  resolvers: Resolvers = {
    Mutation: {
      createProject: async (
        _,
        { workspaceId, name, description },
        { userId }
      ) => {
        await this.admin.ensureUserCanEditWorkspace(userId, workspaceId);

        const project = await this.projectManager.createProject(
          workspaceId,
          name,
          description
        );

        return project;
      },
      updateProject: async (
        _,
        { projectId, name, description },
        { userId }
      ) => {
        await this.projectManager.ensureUserCanViewProject(projectId, userId);

        const project = await this.projectManager.updateProject(projectId, {
          name: name || undefined,
          description: description || undefined,
        });

        return project;
      },

      addProjectTagToProject: async (_, { projectId, tagId }, { userId }) => {
        await this.projectManager.ensureUserCanViewProject(projectId, userId);

        const project = await this.projectManager.addProjectTagToProject(
          projectId,
          tagId
        );

        return project;
      },

      removeProjectTagFromProject: async (
        _,
        { projectId, tagId },
        { userId }
      ) => {
        await this.projectManager.ensureUserCanViewProject(projectId, userId);

        const project = await this.projectManager.removeProjectTagFromProject(
          projectId,
          tagId
        );

        return project;
      },

      updateProjectTagPositions: async (
        _,
        { projectId, tagIds },
        { userId }
      ) => {
        await this.projectManager.ensureUserCanViewProject(projectId, userId);

        const project = await this.projectManager.updateProjectTagPositions(
          projectId,
          tagIds
        );

        return project;
      },
    },
    Query: {
      project: async (_, { id }, { userId }) => {
        await this.projectManager.ensureUserCanViewProject(id, userId);

        const project = await this.projectManager.getProjectById(id);

        return project;
      },
    },
  };
}
