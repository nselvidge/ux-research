import { randomUUID } from "crypto";
import { inject, injectable } from "tsyringe";
import { Identity, IdentityTypes } from "../entities/Identity";
import { addIdentityToUser, getUserEmailDomain, User } from "../entities/User";
import {
  acceptWorkspaceInvite,
  AddMemberEvent,
  addMemberToWorkspace,
  ChangeNameEvent,
  changeWorkspaceName,
  createWorkspace,
  createWorkspaceInviteToken,
  getWorkspaceInviteToken,
  rejectWorkspaceInvite,
  userCanEditWorkspace,
} from "../entities/Workspace";
import {
  deserializeUser,
  ExternalUser,
  PersistenceUser,
  serializeUserForExternal,
} from "./serializers/SerializedUser";
import {
  deserializeWorkspace,
  GatewayWorkspace,
  PersistenceWorkspace,
  PersistenceWorkspaceInvite,
  serializeGatewayWorkspace,
  serializeWorkspace,
} from "./serializers/SerializedWorkspace";

const SHARED_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "google.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "msn.com",
  "live.com",
];

export interface AdminUserRepository {
  createUser: (user: PersistenceUser) => Promise<PersistenceUser>;
  getUserById: (userId: string) => Promise<PersistenceUser>;
  getUserByEmail: (email: string) => Promise<PersistenceUser | null>;
  removeUserFromAllWorkspaces: (userId: string) => Promise<void>;
}

export interface AdminWorkspaceRepository {
  createWorkspace: (
    workspace: PersistenceWorkspace
  ) => Promise<PersistenceWorkspace>;
  getWorkspaceById: (workspaceId: string) => Promise<PersistenceWorkspace>;
  changeName: (event: ChangeNameEvent) => Promise<PersistenceWorkspace>;
  addMemberToWorkspace: (
    event: AddMemberEvent
  ) => Promise<PersistenceWorkspace>;
  createInviteToken: (
    token: PersistenceWorkspaceInvite
  ) => Promise<PersistenceWorkspaceInvite>;
  getWorkspaceByInviteAndExpiration: (
    inviteToken: string,
    isExpired: boolean
  ) => Promise<PersistenceWorkspace>;
  updatePublicInterviewLinks: (
    workspaceId: string,
    publicInterviewLinks: boolean
  ) => Promise<PersistenceWorkspace>;
  getWorkspaceByOwnedDomain: (
    domain: string
  ) => Promise<PersistenceWorkspace | null>;
  updateInviteAccepted: (
    inviteToken: PersistenceWorkspaceInvite
  ) => Promise<void>;
  getWorkspacesByUserId: (userId: string) => Promise<PersistenceWorkspace[]>;
  updateInviteExpired: (token: string, isExpired: boolean) => Promise<void>;
}

export interface AdminRepositories {
  users: AdminUserRepository;
  workspaces: AdminWorkspaceRepository;
}

export interface AuthNotificationService {
  sendWelcomeEmail: (options: {
    userId: string;
    fullName: string;
    workspaceName: string;
  }) => Promise<void>;
  sendConfirmationEmail: (options: {
    userId: string;
    fullName: string;
    workspaceName: string;
  }) => Promise<void>;
  notifyAdminsOfNewSignup: (options: {
    email: string;
    fullName: string;
    workspaceName: string;
  }) => Promise<void>;
  sendInviteEmail: (options: {
    email: string;
    inviterName: string;
    workspaceName: string;
    token: string;
    interviewCount: number;
    highlightCount: number;
  }) => Promise<void>;
}

export interface WorkspaceStatsService {
  getWorkspaceStats: (workspaceId: string) => Promise<{
    interviewCount: number;
    highlightCount: number;
  }>;
}

export interface AdminPublisher {
  publishNewWorkspace: (workspaceId: string) => Promise<void>;
  publishUserWorkspaceChanged: (userId: string) => Promise<void>;
}

export class UserBelongsToWorkspaceError extends Error {
  code = "USER_BELONGS_TO_WORKSPACE";
  constructor() {
    super("User already belongs to another workspace");
  }
}

@injectable()
export class AdminInteractor {
  constructor(
    @inject("Repositories") private repositories: AdminRepositories,
    @inject("AuthNotificationService")
    private notifications: AuthNotificationService,
    @inject("WorkspacePubSub") private publisher: AdminPublisher,
    @inject("WorkspaceStatsService")
    private workspaceStatsService: WorkspaceStatsService
  ) {}

  sendInviteEmail = async (
    email: string,
    workspaceId: string,
    inviterId: string
  ) => {
    let workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    const maybeInvitee = await this.repositories.users.getUserByEmail(email);

    if (maybeInvitee) {
      throw new UserBelongsToWorkspaceError();
    }

    const inviter = await this.repositories.users
      .getUserById(inviterId)
      .then(deserializeUser);

    const event = createWorkspaceInviteToken(workspace, inviterId, email);

    const token = event.newToken;
    workspace = event.workspace;

    await this.repositories.workspaces.createInviteToken(token);

    const workspaceStatistics =
      await this.workspaceStatsService.getWorkspaceStats(workspaceId);

    await this.notifications.sendInviteEmail({
      email,
      inviterName: inviter.fullName,
      workspaceName: workspace.name,
      token: token.token,
      interviewCount: workspaceStatistics.interviewCount,
      highlightCount: workspaceStatistics.highlightCount,
    });

    return serializeGatewayWorkspace(workspace);
  };

  createInviteToken = async (
    inviterId: string,
    workspaceId: string
  ): Promise<PersistenceWorkspaceInvite> => {
    const workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    const { newToken: token } = createWorkspaceInviteToken(
      workspace,
      inviterId,
      null
    );
    await this.repositories.workspaces.createInviteToken(token);

    return token;
  };

  getInviteToken = async (
    inviterId: string,
    workspaceId: string
  ): Promise<PersistenceWorkspaceInvite | undefined> => {
    const workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    const token = getWorkspaceInviteToken(workspace, inviterId);

    return token;
  };

  acceptWorkspaceInvite = async (
    userId: string,
    workspaceId: string
  ): Promise<ExternalUser> => {
    const user = await this.repositories.users
      .getUserById(userId)
      .then(deserializeUser);

    const workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    const inviteToken = workspace.inviteTokens.find(
      (invite) => invite.inviteeEmail === user.email
    );

    if (!inviteToken) {
      throw new Error("No invite found for user");
    }

    const event = acceptWorkspaceInvite(workspace, user, inviteToken.token);

    await this.repositories.users.removeUserFromAllWorkspaces(user.id);

    await this.repositories.workspaces.addMemberToWorkspace(
      event.addMemberEvent
    );

    await this.repositories.workspaces.updateInviteAccepted(
      event.acceptedInvite
    );

    await this.publisher.publishUserWorkspaceChanged(user.id);

    return serializeUserForExternal(user);
  };

  rejectWorkspaceInvite = async (
    userId: string,
    workspaceId: string
  ): Promise<ExternalUser> => {
    const user = await this.repositories.users
      .getUserById(userId)
      .then(deserializeUser);

    const workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    const inviteToken = workspace.inviteTokens.find(
      (invite) => invite.inviteeEmail === user.email
    );

    if (!inviteToken) {
      throw new Error("No invite found for user");
    }

    const event = rejectWorkspaceInvite(workspace, inviteToken.token);

    await this.repositories.workspaces.updateInviteExpired(
      event.updatedToken.token,
      event.updatedToken.isExpired
    );

    return serializeUserForExternal(user);
  };

  getWorkspaceNameForToken = async (token: string) => {
    const workspace =
      await this.repositories.workspaces.getWorkspaceByInviteAndExpiration(
        token,
        false
      );

    return workspace.name;
  };

  signup = async (
    {
      email,
      fullName,
      type,
      token,
    }: {
      email: string;
      fullName: string;
      type: IdentityTypes;
      token: string;
    },
    inviteToken?: string,
    confirmed?: boolean
  ): Promise<ExternalUser> => {
    const identity: Identity = { type, token };

    let user: User = {
      id: randomUUID(),
      email,
      fullName,
      identities: [],
      confirmed: false,
    };

    [user] = addIdentityToUser(user, identity, !!confirmed);

    const emailDomain = getUserEmailDomain(user);

    const owningWorkspace =
      await this.repositories.workspaces.getWorkspaceByOwnedDomain(emailDomain);

    let workspace;
    if (owningWorkspace) {
      workspace = deserializeWorkspace(owningWorkspace);
      let event: AddMemberEvent;
      [event, workspace] = addMemberToWorkspace(workspace, user, "admin");

      await this.repositories.users.createUser(user);
      await this.repositories.workspaces.addMemberToWorkspace(event);
    } else if (!inviteToken) {
      const domain = getUserEmailDomain(user);

      const domainPart = domain.split(".")[0];
      let workspaceName = `${
        domainPart.charAt(0).toUpperCase() + domainPart.slice(1)
      } Workspace`;

      if (SHARED_DOMAINS.includes(domain)) {
        workspaceName = `${user.fullName}'s Workspace`;
      }

      await this.repositories.users.createUser(user);
      workspace = await this.createWorkspace(workspaceName, user.id);
    } else {
      workspace = await this.repositories.workspaces
        .getWorkspaceByInviteAndExpiration(inviteToken, false)
        .then(deserializeWorkspace);

      const event = acceptWorkspaceInvite(workspace, user, inviteToken);

      await this.repositories.users.createUser(user);
      await this.repositories.workspaces.addMemberToWorkspace(
        event.addMemberEvent
      );
      await this.repositories.workspaces.updateInviteAccepted(
        event.acceptedInvite
      );
    }

    if (confirmed) {
      await this.notifications.sendWelcomeEmail({
        userId: user.id,
        fullName: user.fullName,
        workspaceName: workspace.name,
      });
    } else {
      await this.notifications.sendConfirmationEmail({
        userId: user.id,
        fullName: user.fullName,
        workspaceName: workspace.name,
      });
    }

    await this.notifications.notifyAdminsOfNewSignup({
      email: user.email,
      fullName: user.fullName,
      workspaceName: workspace.name,
    });

    return serializeUserForExternal(user);
  };

  createWorkspace = async (
    name: string,
    adminId: string
  ): Promise<GatewayWorkspace> => {
    const admin = await this.repositories.users
      .getUserById(adminId)
      .then(deserializeUser);

    const { workspace } = createWorkspace(name, admin);

    await this.repositories.workspaces.createWorkspace(
      serializeWorkspace(workspace)
    );

    this.publisher.publishNewWorkspace(workspace.id);

    return serializeGatewayWorkspace(workspace);
  };

  canEditWorkspace = async (
    memberId: string,
    workspaceId: string
  ): Promise<boolean> => {
    const workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    return userCanEditWorkspace(workspace, memberId);
  };

  ensureUserCanEditWorkspace = async (
    memberId: string,
    workspaceId: string
  ): Promise<void> => {
    if (!(await this.canEditWorkspace(memberId, workspaceId))) {
      throw new Error("workspace not found");
    }

    return;
  };

  changeWorkspaceName = async (
    workspaceId: string,
    newName: string
  ): Promise<GatewayWorkspace> => {
    let workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);
    let changeNameEvent;

    [changeNameEvent, workspace] = changeWorkspaceName(workspace, newName);

    await this.repositories.workspaces.changeName(changeNameEvent);

    return serializeGatewayWorkspace(workspace);
  };

  addMemberToWorkspace = async (
    workspaceId: string,
    memberId: string
  ): Promise<GatewayWorkspace> => {
    let workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    const user = await this.repositories.users
      .getUserById(memberId)
      .then(deserializeUser);

    let addMemberEvent;

    [addMemberEvent, workspace] = addMemberToWorkspace(
      workspace,
      user,
      "admin"
    );

    await this.repositories.workspaces.addMemberToWorkspace(addMemberEvent);

    return serializeGatewayWorkspace(workspace);
  };

  updatePublicInterviewLinks = (
    workspaceId: string,
    publicInterviewLinks: boolean
  ) => {
    return this.repositories.workspaces
      .updatePublicInterviewLinks(workspaceId, publicInterviewLinks)
      .then(deserializeWorkspace)
      .then(serializeGatewayWorkspace);
  };
}
