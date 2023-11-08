import { ExternalAuthTypes } from "../../entities/ExternalAuth";

export interface PersistenceExternalAuth {
  userId: string;
  type: ExternalAuthTypes;
  authToken: string;
  refreshToken: string;
  expiresAt: Date | null;
}

export const serializeExternalAuth = ({
  userId,
  type,
  authToken,
  refreshToken,
  expiresAt,
}: PersistenceExternalAuth): PersistenceExternalAuth => ({
  userId,
  type,
  authToken,
  refreshToken,
  expiresAt,
});

export const deserializeExternalAuth = ({
  userId,
  type,
  authToken,
  refreshToken,
  expiresAt,
}: PersistenceExternalAuth): PersistenceExternalAuth => ({
  userId,
  type,
  authToken,
  refreshToken,
  expiresAt
})