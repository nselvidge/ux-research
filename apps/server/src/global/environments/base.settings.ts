import { LogLevel } from "fastify";
import path from "node:path";

export interface EnvironmentSettings {
  assetUrl: string;
  s3VideoBucket: string;
  assemblyAIToken?: string;
  localFileStorageFolder: string;
  serverHost: string;
  protocol: "http" | "https";
  port: string;
  videoFolder: string;
  redirectUrl: string;
  redisUrl: string;
  shouldProxyAssets: boolean;
  zoomId?: string;
  zoomSecret?: string;
  zoomVerificationSecret?: string;
  prettyLogs: boolean;
  amqpUrl: string;
  logLevel: LogLevel;
  muxTokenId: string;
  muxTokenSecret: string;
  sendgridApiKey: string;
  analysisServiceUrl: string;
  internalApiToken: string;
  shouldTrackAnalytics: boolean;
  analyticsApiKey: string;
  recallToken?: string;
  recallNativeToken?: string;
  jwtSecret?: string;
  zoomIdV2?: string;
  zoomSecretV2?: string;
  zoomVerificationSecretV2?: string;
  enforceZoomV2?: boolean;
}

const isLogLevel = (level: string | undefined): level is LogLevel =>
  level !== undefined &&
  ["fatal", "error", "warn", "info", "debug", "trace"].includes(level);

export const baseSettings: EnvironmentSettings = {
  assetUrl: process.env.ASSET_URL || "http://web:8081", // "http://localhost:8081",
  s3VideoBucket: process.env.S3_VIDEO_BUCKET || "resonate-uploads-development",
  assemblyAIToken: process.env.ASSEMBLY_TOKEN,
  localFileStorageFolder:
    process.env.LOCAL_FILE_STORAGE_PATH ||
    path.join(__dirname, "../../../.tmp"),
  serverHost: process.env.HOST || "0.0.0.0",
  redirectUrl: process.env.REDIRECT_URL || "http://localhost:8080",
  protocol: (process.env.PROTOCOL as "http" | "https") || "http",
  port: process.env.PORT || "8080",
  videoFolder: process.env.VIDEO_FOLDER || "video",
  redisUrl: process.env.REDIS_URL || "redis://redis:6379/0",
  amqpUrl: process.env.CLOUDAMQP_URL || "amqp://amqp:5672",
  shouldProxyAssets: false,
  recallToken: process.env.RECALL_TOKEN,
  prettyLogs: false,
  logLevel: isLogLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : "info",
  muxTokenId: process.env.MUX_TOKEN_ID || "",
  muxTokenSecret: process.env.MUX_TOKEN_SECRET || "",
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",
  analysisServiceUrl:
    process.env.ANALYSIS_SERVICE_URL || "http://analysis:8082",
  internalApiToken: process.env.INTERNAL_API_TOKEN || "internal-token",
  shouldTrackAnalytics: false,
  analyticsApiKey:
    process.env.ANALYTICS_API_KEY || "53cd8aefba8f9f903c18d61e8b7092f4",
  recallNativeToken: process.env.RECALL_NATIVE_TOKEN,
  jwtSecret: process.env.JWT_SECRET,
  zoomId: process.env.ZOOM_ID,
  zoomSecret: process.env.ZOOM_SECRET,
  zoomVerificationSecret: process.env.ZOOM_VERIFICATION_SECRET,
  zoomIdV2: process.env.ZOOM_ID_V2,
  zoomSecretV2: process.env.ZOOM_SECRET_V2,
  zoomVerificationSecretV2: process.env.ZOOM_VERIFICATION_SECRET_V2,
  enforceZoomV2: process.env.ENFORCE_ZOOM_V2 === "true",
};
