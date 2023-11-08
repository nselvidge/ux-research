import { MemberInteractor } from "./Member";
import { PersistenceIdentity } from "./serializers/SerializedIdentity";
import { PersistenceExternalAuth } from "./serializers/SerializedExternalAuth";
import { inject } from "tsyringe";
import { ExternalAuthTypes } from "../entities/ExternalAuth";
import { AdminInteractor } from "./Admin";
import { IdentityTypes } from "../entities/Identity";
import { Logger } from "@root/global/logger";

interface OAuthProvider {
  getAuthTokenFromCode: (
    code: string,
    options: {
      pkceVerifier?: string;
      redirectUrl?: string;
    }
  ) => Promise<{
    authToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>;
  getSignupDetails: (authToken: string) => Promise<{
    fullName: string;
    email: string;
    type: IdentityTypes;
    token: string;
  }>;

  getUserIdentityByToken: (token: string) => Promise<PersistenceIdentity>;
}

export interface OAuthRepositories {
  externalAuth: ExternalAuthRepository;
}

export type OAuthProviderFactory = (platform: string) => OAuthProvider;

export interface ExternalAuthRepository {
  createExternalAuth: (
    userId: string,
    auth: PersistenceExternalAuth
  ) => Promise<void>;
}

export class OAuthInteractor {
  constructor(
    @inject("") private oAuthProviderFactory: OAuthProviderFactory,
    private member: MemberInteractor,
    private admin: AdminInteractor,
    @inject("Repositories") private repositories: OAuthRepositories,
    @inject("Logger") private logger: Logger
  ) {}

  handleAccessCode = async ({
    code,
    type,
    pkceChallenge,
    pkceVerifier,
    userId,
    isSignup,
    redirectUrl,
    tokenRedirect,
    onUserSession,
    onAccountMatchingEmail,
    onLoginWithNewConnection,
    onAccountClaimed,
    inviteToken,
  }: {
    code: string;
    type: ExternalAuthTypes;
    isSignup?: boolean;
    pkceChallenge?: string;
    pkceVerifier?: string;
    userId?: string;
    redirectUrl?: string;
    tokenRedirect?: string;
    onUserSession: (userId: string) => Promise<void>;
    onAccountMatchingEmail: () => Promise<void>;
    onLoginWithNewConnection: () => Promise<void>;
    onAccountClaimed: () => Promise<void>;
    inviteToken?: string;
  }): Promise<void> => {
    const oAuthProvider = this.oAuthProviderFactory(type);
    const auth = await oAuthProvider.getAuthTokenFromCode(code, {
      pkceVerifier,
      redirectUrl: tokenRedirect,
    });

    if (!userId) {
      const identity = await oAuthProvider.getUserIdentityByToken(
        auth.authToken
      );

      const user = await this.member.maybeFindUserByIdentity(identity);

      if (user) {
        await this.repositories.externalAuth.createExternalAuth(user.id, {
          ...auth,
          expiresAt: new Date(auth.expiresAt),
          userId: user.id,
          type,
        });

        return onUserSession(user.id);
      }

      if (isSignup) {
        const signup = await oAuthProvider.getSignupDetails(auth.authToken);

        const maybeUser = await this.member.getUserByEmail(signup.email);

        // If an account already exists with the external platform user's email, then
        // they must connect the accounts by logging in with email
        if (maybeUser) {
          return onAccountMatchingEmail();
        }

        const newUser = await this.admin.signup(signup, inviteToken, true);

        await this.repositories.externalAuth.createExternalAuth(newUser.id, {
          ...auth,
          expiresAt: new Date(auth.expiresAt),
          userId: newUser.id,
          type,
        });

        await onUserSession(newUser.id);
        return;
      }

      return onLoginWithNewConnection();
    }

    const identity = await oAuthProvider.getUserIdentityByToken(auth.authToken);

    try {
      await this.member.addIdentity(userId, identity);

      await this.repositories.externalAuth.createExternalAuth(userId, {
        ...auth,
        expiresAt: new Date(auth.expiresAt),
        userId,
        type,
      });
      return;
    } catch (err) {
      this.logger.error(`Error signing up with ${type}: `, err);
      return onAccountClaimed();
    }
  };
}
