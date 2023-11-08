import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { IdentityTypes } from "../entities/Identity";
import { AdminUserRepository } from "../interactors/Admin";
import { MemberUserRepository } from "../interactors/Member";
import { PersistenceIdentity } from "../interactors/serializers/SerializedIdentity";
import { PersistenceUser } from "../interactors/serializers/SerializedUser";

@injectable()
export class UserRepository
  implements AdminUserRepository, MemberUserRepository
{
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  defaultIncludes = {
    identities: true,
  };

  createUser: (user: PersistenceUser) => Promise<PersistenceUser> = async ({
    email,
    fullName,
    identities,
    confirmed,
    id,
  }) =>
    this.prisma.user.create({
      data: {
        id,
        email,
        fullName,
        confirmed,
        identities: identities
          ? {
              create: identities.map(({ token, type }) => ({ token, type })),
            }
          : undefined,
      },
      include: this.defaultIncludes,
    });

  addIdentity = async (event: {
    userId: string;
    identity: { token: string; type: IdentityTypes };
    confirmed: boolean;
  }) =>
    this.prisma.user.update({
      where: { id: event.userId },
      data: {
        confirmed: event.confirmed,
        identities: {
          create: { token: event.identity.token, type: event.identity.type },
        },
      },
      include: this.defaultIncludes,
    });

  getUserById = async (id: string) =>
    this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: this.defaultIncludes,
    });

  maybeGetUserById = async (id: string) =>
    this.prisma.user.findUnique({
      where: { id },
      include: this.defaultIncludes,
    });

  getUserByEmail = async (email: string) =>
    this.prisma.user.findUnique({
      where: { email },
      include: this.defaultIncludes,
    });

  findUsersByEmailQuery = async (emailQuery: string) =>
    this.prisma.user.findMany({
      include: this.defaultIncludes,
      where: { email: { contains: emailQuery } },
    });

  maybeFindUserByIdentity = async (identity: PersistenceIdentity) =>
    this.prisma.identity
      .findUnique({
        where: { type_token: { token: identity.token, type: identity.type } },
        include: { user: { include: this.defaultIncludes } },
      })
      .then((identity) => identity?.user);

  removeUserFromAllWorkspaces = async (userId: string) => {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          deleteMany: {},
        },
      },
    });
  };
}
