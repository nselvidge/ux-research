import { fieldEncryptionMiddleware } from "prisma-field-encryption";
import { Prisma, PrismaClient } from "./generated/prisma";

export const prisma = new PrismaClient();

prisma.$use(fieldEncryptionMiddleware({ dmmf: Prisma.dmmf }));
