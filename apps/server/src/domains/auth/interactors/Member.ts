import { isNil, isNot } from "remeda";
import { inject, injectable } from "tsyringe";
import { IdentityTypes } from "../entities/Identity";
import {
  AddIdentityEvent,
  addIdentityToUser,
  userHasIdentity,
} from "../entities/User";
import { userCanViewWorkspace } from "../entities/Workspace";
import {
  deserializeIdentity,
  PersistenceIdentity,
} from "./serializers/SerializedIdentity";
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
  serializeGatewayWorkspace,
} from "./serializers/SerializedWorkspace";

export interface MemberWorkspaceRepository {
  getWorkspacesByUserId: (userId: string) => Promise<PersistenceWorkspace[]>;
  getWorkspaceById: (workspaceId: string) => Promise<PersistenceWorkspace>;
  getWorkspacesWithPendingInvitesForUser: (
    email: string
  ) => Promise<PersistenceWorkspace[]>;
}

export interface MemberUserRepository {
  getUserById: (id: string) => Promise<PersistenceUser>;
  findUsersByEmailQuery: (emailQuery: string) => Promise<PersistenceUser[]>;
  addIdentity: (event: AddIdentityEvent) => Promise<PersistenceUser>;
  maybeFindUserByIdentity: (
    identity: PersistenceIdentity
  ) => Promise<undefined | PersistenceUser>;
  getUserByEmail: (email: string) => Promise<null | PersistenceUser>;
}

export interface MemberInteractorRepositories {
  users: MemberUserRepository;
  workspaces: MemberWorkspaceRepository;
}

interface PendingWorkspaceInvite {
  workspaceId: string;
  workspaceName: string;
  inviterName: string;
}

@injectable()
export class MemberInteractor {
  constructor(
    @inject("Repositories") private repositories: MemberInteractorRepositories
  ) {}

  getMe = async (currentUserId: string): Promise<ExternalUser> => {
    const { email, fullName, id, confirmed } =
      await this.repositories.users.getUserById(currentUserId);

    return { email, fullName, id, confirmed };
  };

  addIdentity = async (
    userId: string,
    identity: { token: string; type: IdentityTypes },
    confirmed?: boolean
  ) => {
    let user = await this.repositories.users
      .getUserById(userId)
      .then(deserializeUser);

    if (userHasIdentity(user, deserializeIdentity(identity))) {
      return serializeUserForExternal(user);
    }

    let event;
    [user, event] = addIdentityToUser(
      user,
      identity,
      confirmed !== undefined ? confirmed : user.confirmed
    );

    await this.repositories.users.addIdentity(event);

    return user;
  };

  canViewWorkspace = async (
    memberId: string,
    workspaceId: string
  ): Promise<boolean> => {
    const workspace = await this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace);

    return userCanViewWorkspace(workspace, memberId);
  };

  getWorkspace = async (workspaceId: string) =>
    this.repositories.workspaces
      .getWorkspaceById(workspaceId)
      .then(deserializeWorkspace)
      .then(serializeGatewayWorkspace);

  getMemberById = async (memberId: string): Promise<ExternalUser> => {
    const { email, fullName, id, confirmed } =
      await this.repositories.users.getUserById(memberId);

    return { email, fullName, id, confirmed };
  };

  getUserWorkspaces = async (userId: string): Promise<GatewayWorkspace[]> =>
    this.repositories.workspaces
      .getWorkspacesByUserId(userId)
      .then((res) =>
        res.map(deserializeWorkspace).map(serializeGatewayWorkspace)
      );

  searchForUsersByEmail = async (
    emailQuery: string
  ): Promise<PersistenceUser[]> =>
    this.repositories.users.findUsersByEmailQuery(emailQuery);

  getUserByEmail = async (email: string) =>
    this.repositories.users.getUserByEmail(email);

  maybeFindUserByIdentity = async (identity: PersistenceIdentity) =>
    this.repositories.users.maybeFindUserByIdentity(identity);

  getWorkspaceInvitesForUser = async (
    userId: string
  ): Promise<PendingWorkspaceInvite[]> => {
    const user = await this.repositories.users
      .getUserById(userId)
      .then(deserializeUser);

    const workspaces =
      await this.repositories.workspaces.getWorkspacesWithPendingInvitesForUser(
        user.email
      );

    return (
      await Promise.all(
        workspaces.map(async (workspace) => {
          const invite = workspace.inviteTokens.find(
            (invite) =>
              invite.inviteeEmail === user.email &&
              !invite.isAccepted &&
              !invite.isExpired
          );

          if (!invite) {
            return null;
          }

          return {
            workspaceId: workspace.id,
            workspaceName: workspace.name,
            inviterName: (
              await this.repositories.users.getUserById(invite.inviterId)
            ).fullName,
          };
        })
      )
    ).filter(isNot(isNil));
  };
}
