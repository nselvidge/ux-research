import { useLocation } from "wouter";
import cookie from "js-cookie";
import { useEffect } from "react";

export const features = {
  activeHighlight: false,
} as const;

export const useFeatures = (feature: keyof typeof features) => {
  const location = useLocation();
  useEffect(() => {
    const enableFeatureParam = new URLSearchParams(window.location.search).get(
      `enable-feature`
    );
    if (enableFeatureParam) {
      cookie.set(`feature-${enableFeatureParam}`, "enabled");
    }
    const disableFeature = new URLSearchParams(window.location.search).get(
      `disable-feature`
    );
    if (disableFeature) {
      cookie.set(`feature-${disableFeature}`, "disabled");
    }
  }, [location]);

  const featureCookie = cookie.get(`feature-${feature}`);

  if (featureCookie === "enabled") {
    return true;
  } else if (featureCookie === "disabled") {
    return false;
  }

  return features[feature];
};
