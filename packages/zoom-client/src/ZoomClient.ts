import { meetings } from "./resources/meetings";
import { TokenRoutes } from "./resources/token";
import { users } from "./resources/users";

const createAuthHeader = (zoomId: string, zoomSecret: string) =>
  Buffer.from(process.env.ZOOM_ID + ":" + process.env.ZOOM_SECRET).toString(
    "base64"
  );

export class ZoomClient {
  public readonly tokens: TokenRoutes;
  public readonly users = users;
  public readonly meetings = meetings;
  constructor(zoomId: string, zoomSecret: string) {
    const header = createAuthHeader(zoomId, zoomSecret);

    this.tokens = new TokenRoutes(header, zoomId, zoomSecret);
  }
}
