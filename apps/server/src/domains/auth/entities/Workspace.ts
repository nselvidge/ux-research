import { randomUUID } from "crypto";
import { first } from "remeda";
import { createProject, Project } from "../../interview/entities/Project";
import { User } from "./User";
import { createWorkspaceInvite, WorkspaceInvite } from "./WorkspaceInvite";

export type RoleType = "admin" | "member";

export interface ChangeNameEvent {
  newName: string;
  workspaceId: string;
}

export interface AddMemberEvent {
  workspaceId: string;
  userId: string;
  type: RoleType;
}

export interface WorkspaceSettings {
  publicInterviewLinks: boolean;
}

export class WorkspaceUserRole {
  constructor(public user: User, public type: RoleType) {}
  static create = ({ user, type }: { user: User; type: RoleType }) =>
    new WorkspaceUserRole(user, type);
}

export interface Workspace {
  id: string;
  name: string;
  roles: WorkspaceUserRole[];
  inviteTokens: WorkspaceInvite[];
  settings: WorkspaceSettings;
  ownedDomain: string | null;
  projects: Project[];
}

export interface CreateWorkspaceEvent {
  workspace: Workspace;
  addMemberEvent: AddMemberEvent;
}

export const createWorkspace = (
  name: string,
  admin: User
): CreateWorkspaceEvent => {
  const [addMemberEvent, workspace] = addMemberToWorkspace(
    {
      id: randomUUID(),
      name,
      inviteTokens: [],
      roles: [],
      settings: {
        publicInterviewLinks: false,
      },
      ownedDomain: null,
      projects: [],
    },
    admin,
    "admin"
  );

  return { addMemberEvent, workspace };
};

export class EmailDoesNotMatchError extends Error {
  code = "EMAIL_DOES_NOT_MATCH";
  constructor() {
    super("Email does not match the invite token");
  }
}

export const acceptWorkspaceInvite = (
  workspace: Workspace,
  member: User,
  inviteToken: string
): {
  addMemberEvent: AddMemberEvent;
  acceptedInvite: WorkspaceInvite;
  workspace: Workspace;
} => {
  const invite = workspace.inviteTokens.find(
    ({ token }) => token === inviteToken
  );

  if (!invite) {
    throw new Error("Invalid invite token");
  } else if (invite.inviteeEmail && invite.inviteeEmail !== member.email) {
    throw new EmailDoesNotMatchError();
  }

  const updatedInvite = {
    ...invite,
    isAccepted: invite.inviteeEmail ? true : false,
  };

  const updatedInviteTokens = workspace.inviteTokens
    .filter(({ token }) => token !== invite.token)
    .concat(updatedInvite);

  let updatedWorkspace = {
    ...workspace,
    inviteTokens: updatedInviteTokens,
  };

  const [addMemberEvent, newWorkspace] = addMemberToWorkspace(
    updatedWorkspace,
    member,
    "admin"
  );

  updatedWorkspace = newWorkspace;

  return {
    addMemberEvent,
    acceptedInvite: updatedInvite,
    workspace: updatedWorkspace,
  };
};

export const rejectWorkspaceInvite = (
  workspace: Workspace,
  inviteToken: string
): {
  workspace: Workspace;
  updatedToken: WorkspaceInvite;
} => {
  const tokenToUpdate = workspace.inviteTokens.find(
    ({ token }) => token === inviteToken
  );

  if (!tokenToUpdate) {
    throw new Error("Invalid invite token");
  }

  const updatedToken = {
    ...tokenToUpdate,
    isExpired: true,
  };

  const updatedInviteTokens = workspace.inviteTokens
    .filter(({ token }) => token !== inviteToken)
    .concat(updatedToken);

  return {
    workspace: {
      ...workspace,
      inviteTokens: updatedInviteTokens,
    },
    updatedToken,
  };
};

export const addMemberToWorkspace = (
  workspace: Workspace,
  member: User,
  type: RoleType
): [AddMemberEvent, Workspace] => {
  const roles = workspace.roles.filter(({ user }) => user.id === member.id);

  return [
    { workspaceId: workspace.id, userId: member.id, type },
    {
      ...workspace,
      roles: roles.concat(WorkspaceUserRole.create({ user: member, type })),
    },
  ];
};

export const userCanEditWorkspace = (workspace: Workspace, userId: string) =>
  ["admin", "member"].includes(
    workspace.roles.find((role) => role.user.id === userId)?.type || ""
  );

export const userCanViewWorkspace = (workspace: Workspace, userId: string) =>
  ["admin", "member"].includes(
    workspace.roles.find((role) => role.user.id === userId)?.type || ""
  );

export const changeWorkspaceName = (
  workspace: Workspace,
  newName: string
): [ChangeNameEvent, Workspace] => {
  return [
    { newName, workspaceId: workspace.id },
    { ...workspace, name: newName },
  ];
};

export const getWorkspaceInviteToken = (
  workspace: Workspace,
  inviterId: string
): WorkspaceInvite | undefined => {
  if (!userCanEditWorkspace(workspace, inviterId)) {
    throw new Error("User cannot invite to workspace");
  }

  const token = first(
    workspace.inviteTokens.filter(
      ({ inviterId: current, isExpired }) => current === inviterId && !isExpired
    )
  );
  return token;
};

export const createWorkspaceInviteToken = (
  workspace: Workspace,
  inviterId: string,
  inviteeEmail: string | null
) => {
  if (
    workspace.roles.find((role) => role.user.id === inviterId) === undefined
  ) {
    throw new Error("User cannot invite to workspace");
  }

  if (
    inviteeEmail !== null &&
    workspace.roles.find((role) => role.user.email === inviteeEmail)
  ) {
    throw new Error("User is already a member of the workspace");
  }

  const newToken = createWorkspaceInvite({
    workspaceId: workspace.id,
    inviterId,
    inviteeEmail,
  });

  return {
    workspace: {
      ...workspace,
      inviteTokens: workspace.inviteTokens.concat(newToken),
    },
    newToken,
  };
};

export const addProjectToWorkspace = (
  workspace: Workspace,
  name: string,
  description: string
) => {
  const project = createProject(name, description, workspace.id);

  return {
    workspace: {
      ...workspace,
      projects: workspace.projects.concat(project),
    },
    newProject: project,
  };
};
