import { User } from "../../entities/User";
import {
  deserializeIdentity,
  PersistenceIdentity,
  serializeIdentity,
} from "./SerializedIdentity";

export interface PersistenceUser {
  id: string;
  fullName: string;
  email: string;
  identities: PersistenceIdentity[];
  confirmed: boolean;
}

export interface ExternalUser {
  id: string;
  fullName: string;
  email: string;
  confirmed: boolean;
}

export const serializeUserForPersistence = ({
  id,
  fullName,
  email,
  identities,
  confirmed,
}: User): PersistenceUser => ({
  id,
  fullName,
  email,
  identities: identities ? identities.map(serializeIdentity) : [],
  confirmed,
});

export const serializeUserForExternal = ({
  id,
  fullName,
  email,
  confirmed,
}: User): ExternalUser => ({ id, fullName, email, confirmed });

export const deserializeUser = ({
  id,
  fullName,
  email,
  identities,
  confirmed,
}: PersistenceUser): User =>
  ({
    id,
    fullName,
    email,
    identities: identities ? identities.map(deserializeIdentity) : [],
    confirmed,
  });
