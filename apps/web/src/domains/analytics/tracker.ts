import * as FullStory from "@fullstory/browser";
import { useEffect } from "react";
import { useMeQuery } from "../page/requests/page.generated";
import { init, track } from "@amplitude/analytics-browser";
import { useLocation } from "wouter";

const TRACKING_HOSTS = [
  "resonate-staging.herokuapp.com",
  "www.resonateapp.com",
];

export const trackEvent = (event: string, data: any) => {
  if (TRACKING_HOSTS.includes(window.location.hostname)) {
    track(event, data);
  } else {
    console.log(event, data);
  }
};

export const useTrackOnce = (event: string, data: any) => {
  useEffect(() => {
    trackEvent(event, data);
  }, []);
};

export const useInitAnalytics = () => {
  const { data } = useMeQuery();

  const shouldTrack = TRACKING_HOSTS.includes(window.location.hostname);

  useEffect(() => {
    if (shouldTrack) {
      FullStory.init({ orgId: "o-1EB7JX-na1" });
    }
  }, []);

  useEffect(() => {
    const me = data?.me;
    if (me && shouldTrack) {
      init("53cd8aefba8f9f903c18d61e8b7092f4", me.id);
      FullStory.setUserVars({
        id: me.id,
        email: me.email,
        displayName: me.fullName,
      });
    } else if (!me) {
      // Track anonymous users
      let anonymousId = localStorage.getItem("anonymousId");
      if (!anonymousId) {
        anonymousId = String(Math.random());
        localStorage.setItem("anonymousId", anonymousId);
      }
      init("53cd8aefba8f9f903c18d61e8b7092f4", anonymousId);
    }
  }, [data?.me?.id, data?.me?.email, data?.me?.fullName]);
};
