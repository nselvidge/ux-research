import { baseSettings, EnvironmentSettings } from "./base.settings";

export const production: EnvironmentSettings = {
  ...baseSettings,
  port: process.env.PORT || "80",
  redirectUrl: process.env.REDIRECT_URL || "https://www.resonateapp.com",
  serverHost: process.env.HOST || "www.resonateapp.com",
  protocol: (process.env.PROTOCOL as "http" | "https") || "https",
  shouldProxyAssets: false,
  s3VideoBucket: process.env.S3_VIDEO_BUCKET || "resonate-uploads-production",
  shouldTrackAnalytics: true,
};
