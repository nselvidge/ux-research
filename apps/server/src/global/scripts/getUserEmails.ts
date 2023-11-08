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
const workspaceId = process.argv[2];

const getUserEmails = async () => {
  const users = await prisma.user.findMany({
    where: workspaceId
      ? {
          roles: {
            some: {
              workspace: {
                id: workspaceId,
              },
            },
          },
        }
      : undefined,
    include: {
      roles: {
        include: {
          workspace: true,
        },
      },
    },
  });

  console.log(users);
};

// const updateUserEmail = async () => {
//   console.log("start");
//   const user = await prisma.user.update({
//     where: {
//       id: "18395556-a7e8-4fd4-bdf1-a7f317ec17cf",
//     },
//     data: {
//       identities: {
//         create: {
//           token: await hash("8dW3UETflAqrr0"),
//           type: "password",
//         },
//         delete: {
//           userId_type: {
//             userId: "18395556-a7e8-4fd4-bdf1-a7f317ec17cf",
//             type: "zoom",
//           },
//         },
//       },
//     },
//   });
//   console.log("done");
// };

// const updateUserEmail = async () => {
//   // await prisma.user.update({
//   //   where: {
//   //     id: "763721f4-6234-44f0-95b7-557a86284f58",
//   //   },
//   //   data: {
//   //     identities: {
//   //       deleteMany: [
//   //         {
//   //           type: "zoom",
//   //         },
//   //         {
//   //           type: "password",
//   //         },
//   //       ],
//   //     },
//   //   },
//   // });
//   await prisma.user.update({
//     where: {
//       id: "10eaec5b-09da-4c49-a036-61213d3b7337",
//     },
//     data: {
//       identities: {
//         create: {
//           type: "password",
//           token: await hash("8dW3UETflAqrr0"),
//         },
//       },
//     },
//   });
//   console.log("done");
// };

// 763721f4-6234-44f0-95b7-557a86284f58

// getUserEmails();
getUserEmails();
