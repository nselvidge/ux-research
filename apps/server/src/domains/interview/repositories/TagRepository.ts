import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { TagColor } from "../entities/Tag";
import { InteractorTagRepository } from "../interactors/InteractorRepositories";
import { PreferenceCustomizerTagRepository } from "../interactors/PreferenceCustomizationInteractor";
import { PersistenceTag } from "../interactors/serializers/SerializedTag";

@injectable()
export class TagRepository
  implements InteractorTagRepository, PreferenceCustomizerTagRepository
{
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  getTagsForProject = async (projectId: string) =>
    this.prisma.tag.findMany({
      where: { highlights: { some: { interview: { projectId } } } },
    });

  getProjectHighlightCounts = async (projectId: string) =>
    this.prisma.tag.findMany({
      where: { highlights: { some: { interview: { projectId } } } },
      include: {
        highlights: {
          select: { id: true },
          where: {
            transcriptId: { not: null },
            interview: { archived: false, projectId },
            videoId: { not: null },
          },
        },
      },
    });

  getProjectTaglessHighlightCounts = async (projectId: string) =>
    this.prisma.highlight.findMany({
      where: {
        transcriptId: { not: null },
        interview: { archived: false, projectId },
        videoId: { not: null },
        tags: {
          none: {},
        },
      },
    });

  create = ({ id, workspaceId, name, color, emoji }: PersistenceTag) =>
    this.prisma.tag.create({ data: { id, workspaceId, name, color, emoji } });

  createMany = async (tags: PersistenceTag[]) => {
    await this.prisma.tag.createMany({
      data: tags.map(
        ({
          id,
          workspaceId,
          name,
          color,
          autoExtract,
          description,
          emoji,
          isDefault,
        }) => ({
          id,
          workspaceId,
          name,
          color,
          autoExtract,
          description,
          emoji,
          isDefault,
        })
      ),
    });
  };

  getTagById = (id: string) =>
    this.prisma.tag.findUniqueOrThrow({ where: { id } });
  getManyById = (ids: string[]) =>
    this.prisma.tag.findMany({ where: { id: { in: ids } } });
  updateTagName = (id: string, name: string) =>
    this.prisma.tag.update({ where: { id }, data: { name } });
  updateTagColor = (id: string, color: TagColor) =>
    this.prisma.tag.update({ where: { id }, data: { color } });
  updateTagEmoji = (id: string, emoji: string) =>
    this.prisma.tag.update({ where: { id }, data: { emoji } });
  getTagsForWorkspace = async (workspaceId: string) =>
    (
      await this.prisma.workspace.findUniqueOrThrow({
        where: { id: workspaceId },
        include: { tags: true },
      })
    ).tags;
  deleteTag = async (id: string) => {
    const [, r2] = await this.prisma.$transaction([
      this.prisma.tag.update({
        where: { id },
        data: {
          highlights: { set: [] },
          projectTags: { deleteMany: {} },
          userOrders: { deleteMany: {} },
        },
        include: { highlights: true, projectTags: true, userOrders: true },
      }),
      this.prisma.tag.delete({ where: { id } }),
    ]);

    return r2;
  };
  getHighlightCounts = async (workspaceId: string) =>
    this.prisma.tag.findMany({
      where: { workspaceId },
      include: {
        highlights: {
          select: { id: true },
          where: {
            transcriptId: { not: null },
            interview: { archived: false },
            videoId: { not: null },
          },
        },
      },
    });

  getTaglessHighlightCount = async (workspaceId: string) =>
    this.prisma.highlight.findMany({
      where: {
        transcriptId: { not: null },
        interview: { archived: false, workspaceId },
        videoId: { not: null },
        tags: {
          none: {},
        },
      },
    });

  getWorkspaceIdForTag = async (tagId: string) =>
    (
      await this.prisma.tag.findUniqueOrThrow({
        where: { id: tagId },
        select: { workspaceId: true },
      })
    ).workspaceId;
}
