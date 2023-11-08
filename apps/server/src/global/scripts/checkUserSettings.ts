import { prisma } from "./scriptUtils";
import axios from "axios";

// You'll need to replace these placeholders with actual values.

async function checkCloudRecordingPermission(userId: string) {
  // Get the user's Zoom API credentials from the ExternalAuth table
  const dbExternalAuth = await prisma.externalAuth.findUniqueOrThrow({
    where: {
      userId_type: {
        userId: userId,
        type: "zoom",
      },
    },
  });

  // check if the authToken needs to be refreshed
  const now = new Date();
  let authToken = dbExternalAuth.authToken;

  if (!dbExternalAuth.expiresAt || now > dbExternalAuth.expiresAt) {
    // refresh the authToken
    const zoomRefreshResponse = await axios.post(
      `https://zoom.us/oauth/token?${new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: dbExternalAuth.refreshToken,
      }).toString()}`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.ZOOM_ID + ":" + process.env.ZOOM_SECRET
          ).toString("base64")}`,
        },
      }
    );

    authToken = zoomRefreshResponse.data.access_token;
  }

  const url = `https://api.zoom.us/v2/users/me/settings`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const canRecord = response.data?.recording?.cloud_recording;

    if (canRecord === undefined) {
      console.log("Could not find recording settings for user.");
    } else if (canRecord) {
      console.log("User can create cloud recordings.");
    } else {
      console.log("User cannot create cloud recordings.");
    }
  } catch (error) {
    console.error(`Failed to get user settings: ${error}`);
  }
}

checkCloudRecordingPermission(process.argv[2]);
