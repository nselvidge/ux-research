import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://b392300bb30840119c8c9f5b7d4b0844@o4504181711765504.ingest.sentry.io/4504181713797120",
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || "development",
});

export const sentry = Sentry;
