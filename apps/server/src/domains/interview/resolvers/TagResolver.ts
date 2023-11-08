import { injectable } from "tsyringe";
import { Resolvers } from "@root/global/generated/graphql";
import { ResearcherInteractor } from "../interactors/ResearcherInteractor";
import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { ConsumerInteractor } from "../interactors/ConsumerInteractor";
import { PreferenceCustomizationInteractor } from "../interactors/PreferenceCustomizationInteractor";

@injectable()
export class TagResolver {
  constructor(
    private researcher: ResearcherInteractor,
    private member: MemberInteractor,
    private consumer: ConsumerInteractor,
    private preferenceCustomization: PreferenceCustomizationInteractor
  ) {}
  resolvers: Resolvers = {
    Mutation: {
      createTag: async (
        _,
        { workspaceId, name, color, projectId, emoji },
        { userId }
      ) => {
        if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
          throw new Error("workspace not found");
        }

        return this.researcher.createTag({
          workspaceId,
          name,
          color: color || undefined,
          projectId: projectId || null,
          emoji,
        });
      },

      updateTagName: async (_, { name, tagId }, { userId }) => {
        await this.researcher.ensureUserIsResearcherWithTag(userId, tagId);

        return this.researcher.updateTagName(tagId, name);
      },

      updateTagColor: async (_, { color, tagId }, { userId }) => {
        await this.researcher.ensureUserIsResearcherWithTag(userId, tagId);

        return this.researcher.updateTagColor(tagId, color);
      },

      updateTagEmoji: async (_, { emoji, tagId }, { userId }) => {
        await this.researcher.ensureUserIsResearcherWithTag(userId, tagId);

        return this.researcher.updateTagEmoji(tagId, emoji);
      },

      deleteTag: async (_, { tagId }, { userId }) => {
        await this.researcher.ensureUserIsResearcherWithTag(userId, tagId);

        return this.researcher.deleteTag(tagId);
      },

      updateUserTagOrder: async (_, { tagIds, workspaceId }, { userId }) => {
        if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
          throw new Error("workspace not found");
        }

        await this.preferenceCustomization.updateUserTagOrder(
          userId,
          workspaceId,
          tagIds
        );

        return this.member.getWorkspace(workspaceId);
      },
    },
    Query: {
      getTagHighlightCounts: async (_, { workspaceId }, { userId }) => {
        if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
          throw new Error("workspace not found");
        }

        return this.researcher.getTagHighlightCounts(workspaceId);
      },

      getTaglessHighlightCounts: async (_, { workspaceId }, { userId }) => {
        if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
          throw new Error("workspace not found");
        }

        return this.researcher.getTaglessHighlightCounts(workspaceId);
      },

      getHighlightsForTag: async (_, { tagId, projectId }, { userId }) => {
        await this.consumer.ensureUserCanViewTag(userId, tagId);

        return this.consumer.getHighlightsForTag(tagId, projectId);
      },

      getHighlightsWithoutTag: async (
        _,
        { workspaceId, projectId },
        { userId }
      ) => {
        if (!(await this.member.canViewWorkspace(userId, workspaceId))) {
          throw new Error("workspace not found");
        }

        return this.consumer.getTaglessHighlights(workspaceId, projectId);
      },
    },

    Workspace: {
      tags: ({ id }, _, { userId }) =>
        this.researcher.getTagsForWorkspace(id, userId),
    },
  };
}
