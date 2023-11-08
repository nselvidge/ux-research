import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { ProjectRepository as InteractorRepository } from "../interactors/InteractorRepositories";
import { PersistenceProject } from "../interactors/serializers/SerializedProject";

@injectable()
export class ProjectRepository implements InteractorRepository {
  defaultInclude = {
    projectTags: {
      include: {
        tag: true,
      },
    },
  };
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  createProject = async (workspaceId: string, project: PersistenceProject) => {
    await this.prisma.project.create({
      data: {
        id: project.id,
        name: project.name,
        workspaceId,
        description: project.description,
      },
    });
  };

  getProjectById = async (projectId: string) =>
    this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: this.defaultInclude,
    });

  updateProject = async (
    projectId: string,
    { name, description }: { name?: string; description?: string }
  ) => {
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
      },
    });
  };
  addProjectTagToProject = async (
    projectId: string,
    { tagId, position }: { tagId: string; position: number }
  ) => {
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        projectTags: {
          create: {
            tagId,
            position,
          },
        },
      },
    });
  };
  removeProjectTagFromProject = async (
    projectId: string,
    projectTags: { tagId: string; position: number }[],
    tagId: string
  ) => {
    const deleteOp = this.prisma.projectTags.delete({
      where: {
        projectId_tagId: {
          projectId,
          tagId,
        },
      },
    });

    const repositionOps = projectTags.map((projectTag) =>
      this.prisma.projectTags.update({
        where: {
          projectId_tagId: {
            projectId,
            tagId: projectTag.tagId,
          },
        },
        data: {
          position: projectTag.position - 1,
        },
      })
    );

    await this.prisma.$transaction([deleteOp, ...repositionOps]);
  };

  updateProjectTagPositions = async (
    projectId: string,
    projectTags: { tagId: string; position: number }[]
  ) => {
    const updateOps = projectTags.map((projectTag) =>
      this.prisma.projectTags.update({
        where: {
          projectId_tagId: {
            projectId,
            tagId: projectTag.tagId,
          },
        },
        data: {
          position: projectTag.position,
        },
      })
    );
    await this.prisma.$transaction(updateOps);
  };
}
