import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

const isProduction = window.location.hostname === "www.resonateapp.com";
const isStaging = window.location.hostname === "resonate-staging.herokuapp.com";

Sentry.init({
  dsn: "https://9bc9d366f6cd43c29159c4be8530626e@o4504181711765504.ingest.sentry.io/4504181713797121",
  integrations: [new BrowserTracing({ tracingOrigins: ["*"] })],
  environment: isProduction
    ? "production"
    : isStaging
    ? "staging"
    : "development",
  tracesSampleRate: 1.0,
});
