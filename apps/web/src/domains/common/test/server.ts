import { setupServer } from "msw/node";

import "cross-fetch/polyfill";

export const server = setupServer();
