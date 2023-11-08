import "reflect-metadata";
import "../moduleAlias";
import { container } from "tsyringe";

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../", `.env.${process.env.NODE_ENV}`),
  override: true,
});

import { createContainer } from "../defaultContainer";
import { PrismaClient } from "../generated/prisma";

// '41001a78-54fa-4100-8312-307d7e5c991f', 'c40f9bd6-eb9a-4e69-9d35-0114a5ecec3b'
createContainer();
const prisma = container.resolve<PrismaClient>("PrismaClient");
// get user ID from command line
const userId = process.argv[2];

const getUserAuth = async () => {
  const users = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      identities: true,
      roles: {
        include: {
          workspace: true,
        },
      },
      sourceAuths: true,
    },
  });

  return users;
};

const disableEmails = async () => {
  const user = await getUserAuth();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: user.email + "-disabled",
    },
  });
};

disableEmails();
