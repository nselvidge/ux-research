import { selector, useRecoilValue } from "recoil";
import zoomSdk, { Apis } from "@zoom/appssdk";
import { useCallback, useEffect, useState } from "react";

const createZoomClient = async (withAuthorization: boolean) => {
  const capabilities: Apis[] = [
    "cloudRecording",
    "onCloudRecording",
    "getMeetingUUID",
    "getRecordingContext",
    "openUrl",
    "launchAppInMeeting",
    "getUserContext",
  ];
  if (withAuthorization) {
    capabilities.push("authorize");
    capabilities.push("onAuthorized");
  }
  const result = await zoomSdk.config({
    capabilities,
    version: "0.16",
    popoutSize: { width: 340, height: 700 },
  });

  if (withAuthorization) {
    zoomSdk.addEventListener(
      "onAuthorized",
      async (authorizedMessage: {
        code: string;
        redirectUri: string;
        state?: string;
        result: boolean;
      }) => {
        console.log("onAuthorized", authorizedMessage);
        const { code, state, redirectUri } = authorizedMessage;
        await fetch(
          `/zoom/auth/code?code=${code}&${
            state ? `state=${state}` : ""
          }&tokenRedirect=${encodeURIComponent(window.location.href)}`
        );
      }
    );

    const { codeChallenge } = await fetch("/zoom/pkce/challenge", {
      method: "POST",
    }).then((res) => res.json());

    await zoomSdk.authorize({
      codeChallenge,
      state: JSON.stringify({ inZoomApp: true }),
    });
  }

  let meetingId: string | undefined;
  let userRole: string | undefined;
  if (result.runningContext !== "inMainClient") {
    const meetingIdResponse = await zoomSdk.getMeetingUUID();
    meetingId = meetingIdResponse.parentUUID || meetingIdResponse.meetingUUID;
    const userContext = await zoomSdk.getUserContext();
    userRole = userContext.role;
  }
  return {
    zoom: zoomSdk,
    meetingId: meetingId || null,
    userRole,
  };
};

const zoomClientState = selector({
  key: "zoom-client",
  get: async () => {
    return createZoomClient(false);
  },
});

const zoomClientWithAuthState = selector({
  key: "zoom-client-with-auth",
  get: async () => {
    return createZoomClient(true);
  },
});

export const useZoomClient = (
  withAuthorization: boolean
): {
  zoom: typeof zoomSdk;
  meetingId: string | null;
  userRole: string | null;
} =>
  useRecoilValue(withAuthorization ? zoomClientWithAuthState : zoomClientState);

export const useCloudRecording = (withAuthorization: boolean) => {
  const { zoom, meetingId, userRole } = useZoomClient(withAuthorization);
  const [{ isRecording, loading, error, localRecording }, setState] = useState({
    isRecording: false,
    loading: true,
    error: false,
    localRecording: false,
  });

  const startRecording = useCallback(async () => {
    // optimistic update
    setState({
      isRecording: true,
      loading: true,
      error: false,
      localRecording: false,
    });
    try {
      const result = await zoom.cloudRecording({ action: "start" });

      if (result.message === "Failure") {
        setState({
          isRecording: false,
          loading: false,
          error: true,
          localRecording: false,
        });
        return false;
      }
    } catch (err) {
      if (err.message === "Local recording is in progress.") {
        setState({
          isRecording: false,
          loading: false,
          error: false,
          localRecording: true,
        });
        return false;
      }
    }
    return true;
  }, []);

  useEffect(() => {
    if (!meetingId) {
      return setState({
        isRecording: false,
        loading: false,
        error: false,
        localRecording: false,
      });
    }
    const handler = async ({
      timestamp,
      action,
    }: {
      timestamp: number;
      action: string;
    }) => {
      if (action === "started") {
        setState({
          isRecording: true,
          loading: false,
          error: false,
          localRecording: false,
        });
      } else if (action === "stopped" || action === "paused") {
        setState({
          isRecording: false,
          loading: false,
          error: false,
          localRecording: false,
        });
      }
    };

    zoom.on("onCloudRecording", handler);

    zoom.getRecordingContext().then((context) => {
      if (context.cloudRecordingStatus === "started") {
        return setState({
          isRecording: true,
          loading: false,
          error: false,
          localRecording: false,
        });
      }
      setState({
        isRecording: false,
        loading: false,
        error: false,
        localRecording: false,
      });
    });

    return () => zoom.off("onCloudRecording", handler);
  }, []);

  return {
    isRecording,
    loading,
    error,
    startRecording,
    meetingId,
    userRole,
    localRecording,
  };
};
