import { Identity, IdentityTypes } from "../../entities/Identity";

export interface PersistenceIdentity {
  token: string;
  type: IdentityTypes;
}

export const serializeIdentity = ({ token, type }: Identity) => ({
  token,
  type,
});

export const deserializeIdentity = ({ token, type }: PersistenceIdentity) =>
  ({ token, type });
