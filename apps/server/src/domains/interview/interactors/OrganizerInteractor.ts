import { ProjectManagerInteractor } from "@root/domains/interview/interactors/ProjectManager";
import {
  PersistenceProject,
  serializeProject,
} from "@root/domains/interview/interactors/serializers/SerializedProject";
import { inject, injectable } from "tsyringe";
import { addInterviewToProject, removeInterviewFromProject } from "../entities/Interview";
import { InteractorRepositories } from "./InteractorRepositories";
import { deserializeInterview, serializeInterview } from "./serializers/SerializedInterview";
import { PersistenceTag } from "./serializers/SerializedTag";

@injectable()
export class OrganizerInteractor {
  constructor(
    @inject("Repositories") private repositories: InteractorRepositories,
    private projectManager: ProjectManagerInteractor
  ) {}

  async moveInterviewsToProject(
    interviewIds: string[],
    projectId: string
  ): Promise<PersistenceProject> {
    const workspace = await this.projectManager.getWorkspaceByProjectId(
      projectId
    );

    const project = workspace.projects.find(
      (project) => project.id === projectId
    );

    if (!project) {
      throw new Error("Project not found");
    }

    const interviews = await Promise.all(
      interviewIds.map((id) =>
        this.repositories.interviews
          .getInterviewById(id)
          .then(deserializeInterview)
      )
    );

    if (
      interviews.some((interview) => interview.workspaceId !== workspace.id)
    ) {
      throw new Error(
        "Interviews must be in the same workspace as the project"
      );
    }

    const updatedInterviews = interviews.map((interview) =>
      addInterviewToProject(interview, projectId)
    );

    await Promise.all(
      updatedInterviews.map((interview) =>
        this.repositories.interviews.updateInterviewProject(
          interview.id,
          interview.projectId
        )
      )
    );

    return serializeProject(project);
  }

  async getTagsForProject(projectId: string): Promise<PersistenceTag[]> {
    return this.repositories.tags.getTagsForProject(projectId);
  }

  getProjectHighlightCounts = async (projectId: string) => {
    const result = await this.repositories.tags.getProjectHighlightCounts(
      projectId
    );

    return result.map(({ id, highlights }) => ({
      tagId: id,
      highlightCount: highlights.length,
    }));
  };

  getProjectTaglessHighlightCounts = async (projectId: string) => {
    const result =
      await this.repositories.tags.getProjectTaglessHighlightCounts(projectId);

    return result.length;
  };

  removeInterviewFromProject = async (
    interviewId: string,
  ) => {
    const interview = await this.repositories.interviews.getInterviewById(interviewId).then(deserializeInterview);

    const updatedInterview = removeInterviewFromProject(interview);

    await this.repositories.interviews.updateInterviewProject(
      updatedInterview.id,
      updatedInterview.projectId
    );

    return serializeInterview(updatedInterview);
  }
}
