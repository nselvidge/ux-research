import { hash, verify } from "argon2";
import { inject, injectable } from "tsyringe";
import { PersistenceUser } from "../interactors/serializers/SerializedUser";

export interface CreateLocalAuth {
  email: string;
  fullName: string;
  password: string;
}

export interface Repositories {
  users: {
    getUserByEmail: (email: string) => Promise<PersistenceUser>;
  };
}

export class NotFoundError extends Error {
  public code = "UserNotFound";
  constructor() {
    super("User not found");
  }
}

export const isNotFound = (err: any): err is NotFoundError =>
  err.code === "UserNotFound";

@injectable()
export class LocalAuth {
  constructor(@inject("Repositories") private repositories: Repositories) {}
  createAuthentication = async (authData: CreateLocalAuth) => {
    return {
      email: authData.email,
      fullName: authData.fullName,
      token: await hash(authData.password),
      type: "password" as const,
    };
  };
  authenticate = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const user = await this.repositories.users.getUserByEmail(email);

    const passwordIdentity = user?.identities?.find(
      (identity) => identity.type === "password"
    );
    if (
      !user ||
      !passwordIdentity ||
      !(await verify(passwordIdentity.token, password))
    ) {
      throw new NotFoundError();
    }

    return user;
  };
}
