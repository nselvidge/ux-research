import { baseSettings } from "./base.settings";

export const staging = {
  ...baseSettings,
  port: process.env.PORT || "80",
  redirectUrl:
    process.env.REDIRECT_URL || "https://resonate-staging.herokuapp.com",
  serverHost: process.env.HOST || "resonate-staging.herokuapp.com",
  protocol: (process.env.PROTOCOL as "http" | "https") || "https",
  shouldProxyAssets: false,
  assetUrl:
    process.env.ASSET_URL || "https://resonate-staging-assets.s3.amazonaws.com",
  s3VideoBucket: process.env.S3_VIDEO_BUCKET || "resonate-uploads-staging",
  shouldTrackAnalytics: true,
};
