import {
  RoleType,
  Workspace,
  WorkspaceUserRole,
} from "../../entities/Workspace";
import {
  deserializeProject,
  PersistenceProject,
  serializeProject,
} from "../../../interview/interactors/serializers/SerializedProject";
import {
  deserializeUser,
  PersistenceUser,
  serializeUserForPersistence,
} from "./SerializedUser";

export type PersistenceWorkspaceInvite = {
  workspaceId: string;
  inviterId: string;
  token: string;
  isExpired: boolean;
  inviteeEmail: string | null;
  isAccepted: boolean;
};

export type PersistenceWorkspaceUserRoles = {
  workspaceId: string;
  userId: string;
  user: PersistenceUser;
  type: RoleType;
};

export type PersistenceWorkspace = {
  id: string;
  name: string;
  inviteTokens: PersistenceWorkspaceInvite[];
  roles: PersistenceWorkspaceUserRoles[];
  publicInterviewLinks: boolean;
  ownedDomain: string | null;
  projects: PersistenceProject[];
};

export type GatewayWorkspace = {
  id: string;
  name: string;
  roles: PersistenceWorkspaceUserRoles[];
  ownedDomain: string | null;
  publicInterviewLinks: boolean;
  pendingInvites: {
    id: string;
    email: string;
    role: RoleType;
  }[];
  projects: PersistenceProject[];
};

const serializeWorkspaceUserRole =
  (workspaceId: string) =>
  ({ user, type }: WorkspaceUserRole): PersistenceWorkspaceUserRoles => ({
    userId: user.id,
    type,
    workspaceId,
    user: serializeUserForPersistence(user),
  });

export const serializeWorkspace = ({
  id,
  name,
  roles,
  inviteTokens,
  settings,
  ownedDomain,
  projects,
}: Workspace): PersistenceWorkspace => ({
  id,
  name,
  inviteTokens,
  roles: roles.map(serializeWorkspaceUserRole(id)),
  publicInterviewLinks: settings.publicInterviewLinks,
  ownedDomain,
  projects: projects.map(serializeProject),
});

export const serializeGatewayWorkspace = ({
  id,
  name,
  roles,
  inviteTokens,
  ownedDomain,
  projects,
  settings,
}: Workspace): GatewayWorkspace => ({
  id,
  name,
  pendingInvites: inviteTokens
    .filter(
      (
        token
      ): token is PersistenceWorkspaceInvite & {
        inviterId: string;
        inviteeEmail: string;
      } => !token.isAccepted && !!token.inviteeEmail
    )
    .map((token) => ({
      id: `${token.inviterId}-${token.inviteeEmail}`,
      email: token.inviteeEmail,
      role: "admin",
    })),
  roles: roles.map(serializeWorkspaceUserRole(id)),
  ownedDomain,
  projects: projects.map(serializeProject),
  publicInterviewLinks: settings.publicInterviewLinks,
});

export const deserializeWorkspaceUserRole = ({
  user,
  type,
}: PersistenceWorkspaceUserRoles) => ({ user: deserializeUser(user), type });

export const deserializeWorkspace = ({
  id,
  name,
  inviteTokens,
  roles,
  publicInterviewLinks,
  ownedDomain,
  projects,
}: PersistenceWorkspace): Workspace => ({
  id,
  name,
  inviteTokens,
  roles: roles.map(deserializeWorkspaceUserRole),
  settings: { publicInterviewLinks },
  ownedDomain,
  projects: projects.map(deserializeProject),
});
