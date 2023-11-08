import {prisma} from './scriptUtils';

import axios from "axios";
import { range } from 'remeda';
import { add, format } from 'date-fns';


async function checkZoomMeeting(interviewId: string) {
  // Get the interview details from the database
  const dbInterview = await prisma.interview.findUniqueOrThrow({
    where: {
      id: interviewId,
    },
    include: {
      creator: true,
      source: true,
    },
  });
  

  // Get the user's Zoom API credentials from the ExternalAuth table
  const dbExternalAuth = await prisma.externalAuth.findUniqueOrThrow({
    where: {
      userId_type: {
        userId: dbInterview.creator.id,
        type: "zoom",
      }
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
          Authorization: `Basic ${
            Buffer.from(process.env.ZOOM_ID + ":" + process.env.ZOOM_SECRET).toString(
              "base64"
            )}`,
        },
      }
    );

    authToken = zoomRefreshResponse.data.access_token;
  }

  // Get the meeting details from the Zoom API
  const zoomMeetingResponse = await axios.get(
    `https://api.zoom.us/v2/past_meetings/${encodeURIComponent(encodeURIComponent('Gol6cz/2TaazdFgkQSVeZw=='))}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  // Get the recording details from the Zoom API
  const zoomRecordingResponse = await axios.get(
    `https://api.zoom.us/v2/meetings/${encodeURIComponent(encodeURIComponent('Gol6cz/2TaazdFgkQSVeZw=='))}/recordings`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  const queryParams = new URLSearchParams({
    page_size: "300",
  });

  const months = range(0, 1);

  const allResults = await Promise.all(
    months
      .map((month) => [
        format(add(new Date(), { months: -month }), "yyyy-MM-dd"),
        format(add(new Date(), { months: -month - 1 }), "yyyy-MM-dd"),
      ])
      .map(([start, end]) => {
        return fetch(
          `https://api.zoom.us/v2/users/me/recordings?${queryParams.toString()}&from=${end}&to=${start}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
          .then((result) => result.json())
          .then(async (data) => {
            return data;
          });
      })
  );


  console.log("Zoom Meeting Response:", zoomMeetingResponse.data);
  console.log("Zoom Recording Response:", zoomRecordingResponse.data);
}

checkZoomMeeting("c4f2caef-5aca-4c43-8b64-53f23a8195a1");