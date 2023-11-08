import { NotFoundError } from "@root/global/generated/prisma/runtime";
import { Resolvers } from "@root/global/generated/graphql";
import { injectable } from "tsyringe";
import { AdminInteractor } from "../interactors/Admin";
import { MemberInteractor } from "../interactors/Member";

@injectable()
export class UserResolver {
  constructor(
    private member: MemberInteractor,
    private admin: AdminInteractor
  ) {}
  resolvers: Resolvers = {
    Query: {
      me: (_, __, { userId }) => (userId ? this.member.getMe(userId) : null),
      workspace: async (_, { id }, { userId }) =>
        (await this.member.canViewWorkspace(userId, id))
          ? this.member.getWorkspace(id)
          : null,
      searchUsersByEmail: (_, { emailQuery }, { userId }) => {
        if (!userId) {
          throw new Error("must be logged in to search for users");
        }
        return this.member.searchForUsersByEmail(emailQuery);
      },
    },
    Mutation: {
      updateWorkspaceName: (_, { id, name }, { userId }) => {
        if (!this.admin.canEditWorkspace(userId, id)) {
          throw new NotFoundError("Could not find workspace");
        }

        return this.admin.changeWorkspaceName(id, name);
      },
      addMemberToWorkspace: (_, { workspaceId, memberId }, { userId }) => {
        if (!this.admin.canEditWorkspace(userId, workspaceId)) {
          throw new Error("User not allowed to edit workspace");
        }

        return this.admin.addMemberToWorkspace(workspaceId, memberId);
      },
      createInviteToken: async (_, { workspaceId }, { userId }) => {
        if (!this.admin.canEditWorkspace(userId, workspaceId)) {
          throw new Error("User not allowed to edit workspace");
        }

        return (await this.admin.createInviteToken(userId, workspaceId)).token;
      },
      updatePublicInterviewLinks: async (
        _,
        { workspaceId, publicInterviewLinks },
        { userId }
      ) => {
        if (!this.admin.canEditWorkspace(userId, workspaceId)) {
          throw new Error("User not allowed to edit workspace");
        }

        return await this.admin.updatePublicInterviewLinks(
          workspaceId,
          publicInterviewLinks
        );
      },
      sendInviteEmail: async (_, { email, workspaceId }, { userId }) => {
        if (!this.admin.canEditWorkspace(userId, workspaceId)) {
          throw new Error("User not allowed to edit workspace");
        }

        return await this.admin.sendInviteEmail(email, workspaceId, userId);
      },
      acceptInvite: async (_, { workspaceId }, { userId }) => {
        return await this.admin.acceptWorkspaceInvite(userId, workspaceId);
      },
      rejectInvite: async (_, { workspaceId }, { userId }) => {
        return await this.admin.rejectWorkspaceInvite(userId, workspaceId);
      },
    },
    Workspace: {
      currentUserInviteToken: async ({ id }, _, { userId }) => {
        const token = await this.admin.getInviteToken(userId, id);
        return token?.token || null;
      },
    },
    User: {
      workspaces: ({ id }) => this.member.getUserWorkspaces(id),
      pendingWorkspaceInvites: ({ id }) =>
        this.member.getWorkspaceInvitesForUser(id),
    },
    WorkspaceRole: {
      user: ({ userId }) => this.member.getMemberById(userId),
    },
  };
}
