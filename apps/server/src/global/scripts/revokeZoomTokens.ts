import { prisma } from "./scriptUtils";

import axios from "axios";
import { range } from "remeda";
import { add, format } from "date-fns";

import { ZoomClient } from "zoom-client";

const revokeToken = async (token: string) => {
  console.log(process.env.ZOOM_ID, process.env.ZOOM_SECRET);
  const zoomClient = new ZoomClient(
    process.env.ZOOM_ID!,
    process.env.ZOOM_SECRET!
  );
  await zoomClient.tokens.revokeAuthToken(token);
};

const getUserToken = async (userId: string) => {
  const dbExternalAuth = await prisma.externalAuth.findUniqueOrThrow({
    where: {
      userId_type: {
        userId,
        type: "zoom",
      },
    },
  });

  return dbExternalAuth.authToken;
};

const revokeTokenByUserId = async (userId: string) => {
  try {
    const token = await getUserToken(userId);
    await revokeToken(token);
    console.log("Revoked token for user", userId);
  } catch (err) {
    // console.log(err);
  }
};

revokeTokenByUserId("665a3807-b414-420a-be0b-c2f6d342422d");
