export type ExternalAuthTypes = "zoom" | "zoomV2";

export interface ExternalAuth {
  userId: string;
  type: ExternalAuthTypes;
  authToken: string;
  refreshToken: string;
  expiresAt: Date | null;
}
