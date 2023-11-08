import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { AddMemberEvent, ChangeNameEvent } from "../entities/Workspace";
import { AdminWorkspaceRepository } from "../interactors/Admin";
import { MemberWorkspaceRepository } from "../interactors/Member";
import { WorkspaceRepository as ProjectManagerWorkspaceRepository } from "../../interview/interactors/InteractorRepositories";
import {
  PersistenceWorkspace,
  PersistenceWorkspaceInvite,
} from "../interactors/serializers/SerializedWorkspace";

@injectable()
export class WorkspaceRepository
  implements
    AdminWorkspaceRepository,
    MemberWorkspaceRepository,
    ProjectManagerWorkspaceRepository
{
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  defaultInclude = {
    roles: { include: { user: { include: { identities: true } } } },
    inviteTokens: {
      where: { isExpired: false },
    },
    projects: {
      include: {
        projectTags: {
          include: {
            tag: true,
          },
        },
      },
    },
  };

  getWorkspaceByProjectId = async (projectId: string) =>
    this.prisma.workspace.findFirstOrThrow({
      where: { projects: { some: { id: projectId } } },
      include: this.defaultInclude,
    });

  createWorkspace: (
    workspace: PersistenceWorkspace
  ) => Promise<PersistenceWorkspace> = async (workspace) =>
    this.prisma.workspace.create({
      data: {
        id: workspace.id,
        name: workspace.name,
        roles: {
          createMany: {
            data: workspace.roles.map(({ userId, type }) => ({
              userId,
              type,
            })),
          },
        },
        publicInterviewLinks: workspace.publicInterviewLinks,
      },
      include: this.defaultInclude,
    });

  getWorkspacesByUserId = (userId: string) =>
    this.prisma.workspace.findMany({
      where: { roles: { some: { userId } } },
      include: this.defaultInclude,
    });

  getWorkspaceById = async (workspaceId: string) =>
    this.prisma.workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      include: this.defaultInclude,
    });

  changeName = async ({ newName, workspaceId }: ChangeNameEvent) =>
    this.prisma.workspace.update({
      where: { id: workspaceId },
      data: { name: newName },
      include: this.defaultInclude,
    });

  addMemberToWorkspace = async ({
    userId,
    workspaceId,
    type,
  }: AddMemberEvent) =>
    this.prisma.workspace.update({
      where: { id: workspaceId },
      data: { roles: { create: { userId, type } } },
      include: this.defaultInclude,
    });

  createInviteToken = async ({
    workspaceId,
    inviterId,
    isExpired,
    token,
    isAccepted,
    inviteeEmail,
  }: PersistenceWorkspaceInvite) =>
    this.prisma.workspaceInvite.create({
      data: {
        workspaceId,
        inviterId,
        isExpired,
        token,
        isAccepted,
        inviteeEmail,
      },
    });

  updateInviteAccepted = async ({
    token,
    isAccepted,
  }: {
    token: string;
    isAccepted: boolean;
  }) => {
    await this.prisma.workspaceInvite.update({
      where: { token },
      data: { isAccepted },
    });
  };

  getWorkspaceByInviteAndExpiration = async (
    token: string,
    isExpired: boolean
  ) =>
    (
      await this.prisma.workspaceInvite.findFirstOrThrow({
        where: { token, isExpired },
        include: { workspace: { include: this.defaultInclude } },
      })
    ).workspace;

  updatePublicInterviewLinks = async (
    workspaceId: string,
    publicInterviewLinks: boolean
  ) =>
    this.prisma.workspace.update({
      where: { id: workspaceId },
      data: { publicInterviewLinks },
      include: this.defaultInclude,
    });

  getWorkspaceByOwnedDomain = async (domain: string) =>
    this.prisma.workspace.findFirst({
      where: { ownedDomain: domain },
      include: this.defaultInclude,
    });

  getWorkspacesWithPendingInvitesForUser = async (email: string) =>
    this.prisma.workspace.findMany({
      where: {
        inviteTokens: {
          some: {
            inviteeEmail: email,
            isAccepted: false,
            isExpired: false,
          },
        },
      },
      include: this.defaultInclude,
    });

  updateInviteExpired = async (token: string, isExpired: boolean) => {
    await this.prisma.workspaceInvite.update({
      where: { token },
      data: { isExpired },
    });
  };
}
