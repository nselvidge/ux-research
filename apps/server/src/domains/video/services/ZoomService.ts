import fetch from "node-fetch";
import { inject, injectable } from "tsyringe";
import {
  VideoSourceService,
  VideoStorageService,
} from "../../interview/interactors/InteractorServices";
import { object, string, number, InferType, array } from "yup";
import { VideoImportSource } from "../interactors/CreatorInteractor";
import { Readable } from "stream";
import { Settings } from "@root/global/Settings";
import { add, format } from "date-fns";
import {
  ZoomAuth,
  ZoomAuthFactory,
} from "@root/domains/auth/services/ZoomAuth";
import { range } from "remeda";
import { ZoomClient } from "zoom-client";
import pino from "pino";
import { RecordableProvider } from "../interactors/RecorderInteractor";
import {
  ZoomCredentialManager,
  ZoomVersions,
} from "@root/global/ZoomCredentialManager";
import { ExternalAuthTypes } from "@root/domains/auth/entities/ExternalAuth";

const meetingRecordingsResponseSchema = object({
  duration: number().required(),
  host_id: string().required(),
  uuid: string().required(),
  start_time: string().required(),
  topic: string(),
  recording_files: array(
    object({
      download_url: string().required(),
      file_size: string().required(),
      file_type: string(),
      recording_start: string().required(),
      recording_end: string(),
    })
  ),
});

const zoomRecordingResponseSchema = object({
  next_page_token: string(),
  page_count: number(),
  page_size: number(),
  total_records: number(),
  meetings: array(meetingRecordingsResponseSchema),
});

type ZoomRecordingsResponse = InferType<typeof zoomRecordingResponseSchema>;

type ZoomMeetingRecordingsResponse = InferType<
  typeof meetingRecordingsResponseSchema
>;

const isZoomRecordingResponse = (
  data: unknown
): data is ZoomRecordingsResponse =>
  zoomRecordingResponseSchema.isValidSync(data);

const isZoomMeetingRecordingsResponse = (
  data: unknown
): data is ZoomMeetingRecordingsResponse =>
  meetingRecordingsResponseSchema.isValidSync(data);

interface SourceAuth {
  expiresAt: Date | null;
  authToken: string;
  refreshToken: string;
  type: ExternalAuthTypes;
}

const isMeetingResponseError = (
  data: unknown
): data is { message: string; response: unknown } => {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    "response" in data
  );
};

@injectable()
export class ZoomService
  implements VideoSourceService, VideoImportSource, RecordableProvider
{
  baseUrl = "https://api.zoom.us/v2";
  public requiresAuth = true;

  constructor(
    private settings: Settings,
    private zoomAuthFactory: ZoomAuthFactory,
    @inject("Logger") private logger: pino.Logger,
    private credentials: ZoomCredentialManager
  ) {
    this.setAppVersion("");
  }

  setAppVersion = (version: "" | "V2") => {
    this.credentials.setVersion(version);
  };

  getRedirectUrl = (version: ZoomVersions) => {
    return `${this.settings.getSetting("redirectUrl")}/zoom${
      version === "" ? "" : `/${version}`
    }/auth/code`;
  };

  getZoomClient = (type: "zoom" | "zoomV2") => {
    let version: ZoomVersions = type === "zoom" ? "" : "V2";
    const credentials = this.credentials.getCredentialsForVersion(version);

    return new ZoomClient(credentials.id, credentials.secret);
  };

  getVideoName: (userId: string, externalId: string) => Promise<string> =
    async (userId, externalId) => {
      const auth = await this.ensureAuth(userId);
      const meeting = await this.getMeetingRecording(externalId, auth);

      return meeting.topic || "Zoom Meeting";
    };

  getVideoDate = async (userId: string, externalId: string) => {
    const auth = await this.ensureAuth(userId);
    const meeting = await this.getPastMeeting(externalId, auth);
    return new Date(meeting.start_time);
  };

  getPendingVideoName: (userId: string, externalId: string) => Promise<string> =
    async (userId, externalId) => {
      const auth = await this.ensureAuth(userId);
      const meeting = await this.getPendingMeeting(externalId, auth);

      return meeting.topic;
    };

  getPendingVideoDate = async (userId: string, externalId: string) => {
    const auth = await this.ensureAuth(userId);
    const meeting = await this.getPendingMeeting(externalId, auth);
    return meeting.start_time
      ? new Date(meeting.start_time)
      : new Date(meeting.created_at);
  };

  getTokenHeader = (token: string) => `Bearer ${token}`;

  getPendingMeeting = async (meetingId: string, auth: SourceAuth) => {
    try {
      return this.getZoomClient(auth.type).meetings.getMeeting(
        auth.authToken,
        meetingId
      );
    } catch (e) {
      if (isMeetingResponseError(e)) {
        this.logger.error("Error retreiving zoom meeting details: ", {
          response: e.response,
          meetingId,
        });
      }
      throw e;
    }
  };

  getPastMeeting = async (meetingId: string, auth: SourceAuth) => {
    try {
      return this.getZoomClient(auth.type).meetings.getPastMeeting(
        auth.authToken,
        meetingId
      );
    } catch (e) {
      if (isMeetingResponseError(e)) {
        this.logger.error("Error retreiving zoom meeting details: ", {
          response: e.response,
          meetingId,
        });
      }
      throw e;
    }
  };

  getMeetingRecording = async (
    meetingId: string,
    auth: SourceAuth
  ): Promise<ZoomMeetingRecordingsResponse> => {
    const doubleEncoded = encodeURIComponent(encodeURIComponent(meetingId));
    const result = await fetch(
      `${this.baseUrl}/meetings/${doubleEncoded}/recordings`,
      {
        method: "GET",
        headers: {
          Authorization: this.getTokenHeader(auth.authToken),
        },
      }
    );

    const data = await result.json();

    if (!isZoomMeetingRecordingsResponse(data)) {
      this.logger.error("Error retreiving zoom meeting details: ", {
        response: data,
        meetingId,
      });
      throw new Error("error retreiving zoom meeting details");
    }

    return data;
  };

  getSpeakerData = async () => null;

  isVideoReady = async (externalId: string, userId: string) => {
    const auth = await this.ensureAuth(userId);
    try {
      await this.getMeetingRecording(externalId, auth);
      return true;
    } catch (err) {
      this.logger.error("Error getting meeting recording: ", {
        err,
        externalId,
        userId,
      });
      return false;
    }
  };

  pushVideoToDestination = async (
    externalId: string,
    userId: string,
    videoDestination: VideoStorageService
  ) => {
    const auth = await this.ensureAuth(userId);

    this.logger.info("getting meeting");
    const meeting = await this.getMeetingRecording(externalId, auth);

    const videoFile = meeting.recording_files?.find(
      (recording) => recording.file_type === "MP4"
    );

    if (!videoFile) {
      this.logger.error("Invalid meeting recording: ", {
        meeting,
        externalId,
        userId,
      });
      throw new Error("invalid meeting recording");
    }

    const response = await fetch(videoFile.download_url, {
      headers: { Authorization: this.getTokenHeader(auth.authToken) },
    });

    const recordingId = await videoDestination.uploadVideo(
      Readable.from(response.body)
    );

    return {
      recordingId,
      startTime: new Date(videoFile.recording_start),
    };
  };

  ensureAuth = async (userId: string) => {
    const zoomAuth = await this.zoomAuthFactory.getZoomAuthByUserId(userId);

    if (!zoomAuth) {
      throw new Error("no zoom auth found");
    }

    return zoomAuth.ensureAuth(userId);
  };

  getRecordingListPage = async (userId: string, pageToken?: string) => {
    const auth = await this.ensureAuth(userId);

    const queryParams = new URLSearchParams({
      page_size: "300",
    });

    if (pageToken) {
      queryParams.set("next_page_token", pageToken);
    }

    const months = range(0, 12);

    const allResults = await Promise.all(
      months
        .map((month) => [
          format(add(new Date(), { months: -month }), "yyyy-MM-dd"),
          format(add(new Date(), { months: -month - 1 }), "yyyy-MM-dd"),
        ])
        .map(([start, end]) => {
          return fetch(
            `${
              this.baseUrl
            }/users/me/recordings?${queryParams.toString()}&from=${end}&to=${start}`,
            {
              headers: { Authorization: this.getTokenHeader(auth.authToken) },
            }
          )
            .then((result) => result.json())
            .then(async (data) => {
              zoomRecordingResponseSchema.validateSync(data);
              if (!isZoomRecordingResponse(data)) {
                this.logger.error("Error getting zoom recordings: ", {
                  response: data,
                  userId,
                });
                throw new Error("failed to get recordings from zoom api");
              }
              return data;
            });
        })
    );

    const data = allResults.reduce(
      (acc, result) => ({
        ...acc,
        total_records:
          acc.total_records +
          (result.total_records || result?.meetings?.length || 0),
        recordings: acc.recordings.concat(
          result.meetings
            ?.filter(
              (meeting) =>
                !!meeting.recording_files?.find(
                  (recording) => recording.file_type === "MP4"
                )
            )
            .map((meeting) => ({
              label: meeting.topic || "Zoom Meeting",
              externalId: meeting.uuid,
              startTime: meeting.start_time,
            })) || []
        ),
      }),
      {
        total_records: 0,
        page_count: 1,
        next_page_token: undefined,
        recordings: [] as {
          label: string;
          externalId: string;
          startTime: string;
        }[],
      }
    );

    return {
      totalCount: data.total_records,
      totalPages: data.page_count,
      nextPageToken: data.next_page_token,
      recordings: data.recordings,
    };
  };

  getRecordableUrl = async ({
    idToJoin,
    userId,
  }: {
    idToJoin: string;
    userId: string;
  }) => {
    const auth = await this.ensureAuth(userId);

    const meeting = await this.getPendingMeeting(idToJoin, auth);

    return { joinUrl: meeting.join_url };
  };

  getMeetingJoinToken = async ({
    meetingId,
    userId,
  }: {
    meetingId: string;
    userId: string;
  }): Promise<string> => {
    const auth = await this.ensureAuth(userId);

    const { id } = await this.getPendingMeeting(meetingId, auth);

    const tokenResponse = await this.getZoomClient(
      auth.type
    ).meetings.jointoken.getLocalRecordingToken(auth.authToken, id);

    return tokenResponse.token;
  };
}

@injectable()
export class ZoomServiceFactory {
  constructor(
    @inject("ZoomServiceV1") private v1: ZoomService,
    @inject("ZoomServiceV2") private v2: ZoomService
  ) {}

  getZoomService = (version: ZoomVersions) => {
    switch (version) {
      case "":
        return this.v1;
      case "V2":
        return this.v2;
    }
  };
}
