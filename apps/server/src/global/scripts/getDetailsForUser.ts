import "reflect-metadata";
import "../moduleAlias";
import { container } from "tsyringe";

import dotenv from "dotenv";
import path from "path";
import { hash, verify } from "argon2";

dotenv.config({
  path: path.resolve(__dirname, "../../../", `.env.${process.env.NODE_ENV}`),
  override: true,
});

import { createContainer } from "../defaultContainer";
import { PrismaClient } from "../generated/prisma";

createContainer();
const prisma = container.resolve<PrismaClient>("PrismaClient");
// get workspace ID from command line
const userId = process.argv[2];

const getUserEmails = async () => {
  const users = await prisma.user.findUnique({
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
    },
  });

  console.dir(users);
  return users;
};

const checkPassword = async () => {
  const user = await getUserEmails();
  const password = await verify(
    user?.identities[0].token || "",
    "8dW3UETflAqrr0"
  );
  console.log(password);
};

checkPassword();
