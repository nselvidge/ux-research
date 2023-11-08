import { getTokenHeader } from "../utils";
import fetch from "node-fetch";
import { object, string, InferType, number } from "yup";
import { BASE_URL } from "../consts";

const pastMeetingResponse = object({
  id: string().required(),
  uuid: string().required(),
  start_time: string().required(),
  topic: string().required(),
});

type PastMeetingResponseType = InferType<typeof pastMeetingResponse>;

const isZoomPastMeetingResponse = (
  data: unknown
): data is PastMeetingResponseType => pastMeetingResponse.isValidSync(data);

const meetingResponse = object({
  id: string().required(),
  uuid: string().required(),
  created_at: string().required(),
  start_time: string(),
  topic: string().required(),
  join_url: string().required(),
});

type MeetingResponseType = InferType<typeof meetingResponse>;

const isZoomMeetingResponse = (data: unknown): data is MeetingResponseType =>
  meetingResponse.isValidSync(data);

export class MeetingResponseError extends Error {
  constructor(message: string, public readonly response: any) {
    super(message);
  }
}

const joinTokenResponse = object({
  token: string().required(),
  expire_in: number().required(),
});

type JoinTokenResponseType = InferType<typeof joinTokenResponse>;

const isJoinTokenResponse = (data: unknown): data is JoinTokenResponseType =>
  joinTokenResponse.isValidSync(data);

export const meetings = {
  getPastMeeting: async (token: string, meetingId: string) => {
    const doubleEncoded = encodeURIComponent(encodeURIComponent(meetingId));
    const result = await fetch(`${BASE_URL}/past_meetings/${doubleEncoded}`, {
      method: "GET",
      headers: {
        Authorization: getTokenHeader(token),
      },
    });

    const data = await result.json();

    pastMeetingResponse.validateSync(data);

    if (!isZoomPastMeetingResponse(data)) {
      throw new MeetingResponseError(
        "error retreiving zoom meeting details",
        data
      );
    }

    return data;
  },
  getMeeting: async (token: string, meetingId: string) => {
    const result = await fetch(
      `${BASE_URL}/meetings/${encodeURIComponent(
        encodeURIComponent(meetingId)
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: getTokenHeader(token),
        },
      }
    );

    const data = await result.json();

    if (!isZoomMeetingResponse(data)) {
      throw new MeetingResponseError(
        "error retreiving zoom meeting details",
        data
      );
    }

    return data;
  },
  jointoken: {
    // get local recording token from /meetings/{meetingId}/jointoken/local_recording
    // meetingId must be the ID, not the UUID
    getLocalRecordingToken: async (token: string, meetingId: string) => {
      const result = await fetch(
        `${BASE_URL}/meetings/${meetingId}/jointoken/local_recording`,
        {
          method: "GET",
          headers: {
            Authorization: getTokenHeader(token),
          },
        }
      );

      const data = await result.json();

      if (!isJoinTokenResponse(data)) {
        throw new MeetingResponseError(
          "error retreiving zoom meeting details",
          data
        );
      }

      return data;
    },
  },
};
