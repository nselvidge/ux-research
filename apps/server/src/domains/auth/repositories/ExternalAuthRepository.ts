import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { ExternalAuthTypes } from "../entities/ExternalAuth";

@injectable()
export class ExternalAuthRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  createExternalAuth = ({
    userId,
    authToken,
    refreshToken,
    expiresAt,
    type,
  }: {
    userId: string;
    authToken: string;
    refreshToken: string;
    expiresAt: Date | null;
    type: ExternalAuthTypes;
  }) =>
    this.prisma.externalAuth.upsert({
      where: { userId_type: { userId, type } },
      create: { userId, authToken, expiresAt, refreshToken, type },
      update: { authToken, expiresAt, refreshToken },
    });

  getExternalAuth = ({ userId, type }: { userId: string; type: ExternalAuthTypes }) =>
    this.prisma.externalAuth.findUniqueOrThrow({
      where: { userId_type: { userId, type } },
    });

  maybeGetExternalAuth = ({ userId, type }: { userId: string; type: ExternalAuthTypes }) =>
    this.prisma.externalAuth.findUnique({
      where: { userId_type: { userId, type } },
    });

  deleteExternalAuth = ({ userId, type }: { userId: string; type: ExternalAuthTypes }) =>
    this.prisma.externalAuth.delete({
      where: { userId_type: { userId, type } },
    });

  getAllExternalAuths = (userId: string) =>
    this.prisma.externalAuth.findMany({
      where: { userId },
    });
}
