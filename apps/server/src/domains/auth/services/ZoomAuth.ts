import { Settings } from "@root/global/Settings";
import { inject, injectable } from "tsyringe";
import { ZoomClient } from "zoom-client";
import { PersistenceIdentity } from "../interactors/serializers/SerializedIdentity";
import { ExternalAuthRepository } from "../repositories/ExternalAuthRepository";
import crypto from "crypto";
import {
  ZoomCredentialManager,
  ZoomVersions,
} from "@root/global/ZoomCredentialManager";
import { ExternalAuthTypes } from "../entities/ExternalAuth";
import { sortBy } from "remeda";

export interface ExternalAuth {
  expiresAt: Date | null;
  authToken: string;
  refreshToken: string;
  type: ExternalAuthTypes;
}

function unpack(context: string) {
  // Decode base64
  let buf = Buffer.from(context, "base64");
  // Get iv length (1 byte)
  const ivLength = buf.readUInt8();
  buf = buf.slice(1);
  // Get iv
  const iv = buf.slice(0, ivLength);
  buf = buf.slice(ivLength);
  // Get aad length (2 bytes)
  const aadLength = buf.readUInt16LE();
  buf = buf.slice(2);
  // Get aad
  const aad = buf.slice(0, aadLength);
  buf = buf.slice(aadLength);
  // Get cipher length (4 bytes)
  const cipherLength = buf.readInt32LE();
  buf = buf.slice(4);
  // Get cipherText
  const cipherText = buf.slice(0, cipherLength);
  // Get tag
  const tag = buf.slice(cipherLength);
  return {
    iv,
    aad,
    cipherText,
    tag,
  };
}

function decrypt(context: string, secret: string) {
  const { iv, aad, cipherText, tag } = unpack(context);
  const decipher = crypto
    .createDecipheriv(
      "aes-256-gcm",
      crypto.createHash("sha256").update(secret).digest(),
      iv
    )
    .setAAD(aad)
    .setAuthTag(tag)
    .setAutoPadding(false);

  const decrypted = Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf-8"));
}

export type ZoomAppVersion = "" | "V2";

@injectable()
export class ZoomAuth {
  constructor(
    private settings: Settings,
    private externalAuth: ExternalAuthRepository,
    private credentials: ZoomCredentialManager
  ) {
    this.setAppVersion("");
  }
  getRedirectUrl = () => {
    const version = this.credentials.getCurrentVersion();
    const versionPath = version === "" ? "" : `/${version.toLowerCase()}`;
    return `${this.settings.getSetting(
      "redirectUrl"
    )}/zoom${versionPath}/auth/code`;
  };

  setAppVersion = (version: "" | "V2") => {
    this.credentials.setVersion(version);
  };

  getVerificationSecret = () => {
    const credentials = this.credentials.getCredentials();
    return credentials.verificationSecret;
  };

  getZoomAuthorizationUrl = () => {
    const credentials = this.credentials.getCredentials();

    return `https://zoom.us/oauth/authorize?response_type=code&client_id=${
      credentials.id
    }&redirect_uri=${encodeURIComponent(this.getRedirectUrl())}`;
  };

  getSignupDetails = async (token: string) => {
    const zoom = this.getZoomClient();
    const zoomUser = await zoom.users.getCurrentUser(token);
    return {
      token: zoomUser.id,
      type: "zoom" as const,
      email: zoomUser.email,
      fullName: `${zoomUser.first_name} ${zoomUser.last_name}`,
    };
  };

  getZoomType = () => {
    const zoomVersion = this.credentials.getCurrentVersion();
    return `zoom${zoomVersion}` as const;
  };

  getZoomClient = () => {
    const credentials = this.credentials.getCredentials();

    return new ZoomClient(credentials.id, credentials.secret);
  };

  decryptZoomAppContext = async (
    encryptedContext: string
  ): Promise<{ type: string; uid: string }> => {
    const credentials = this.credentials.getCredentials();
    const context = decrypt(encryptedContext, credentials.secret);
    return context;
  };

  getUserIdentity = async (userId: string): Promise<PersistenceIdentity> => {
    const auth = await this.ensureAuth(userId);
    return this.getUserIdentityByToken(auth.authToken);
  };

  getUserIdentityByToken = async (
    token: string
  ): Promise<PersistenceIdentity> => {
    const zoom = this.getZoomClient();
    const zoomUser = await zoom.users.getCurrentUser(token);
    return { token: zoomUser.id, type: "zoom" };
  };

  getAuthTokenFromCode = (
    authCode: string,
    codeVerifier: string | undefined,
    redirect: string = this.getRedirectUrl()
  ) => {
    const zoom = this.getZoomClient();
    return zoom.tokens.getAuthToken(authCode, {
      redirectUrl: redirect,
      codeVerifier,
    });
  };

  getUserAuth = async (userId: string) =>
    this.externalAuth.getExternalAuth({
      userId,
      type: this.getZoomType(),
    });

  storeUserAuth = async (
    { expiresAt, authToken, refreshToken }: ExternalAuth,
    userId: string
  ) =>
    this.externalAuth.createExternalAuth({
      userId,
      expiresAt,
      authToken,
      refreshToken,
      type: this.getZoomType(),
    });

  refreshAuthToken = async (userId: string) => {
    const zoom = this.getZoomClient();
    const auth = await this.getUserAuth(userId);
    const refreshedAuth = await zoom.tokens.refreshAuthToken({
      ...auth,
      expiresAt: auth.expiresAt?.getTime() || 0,
    });
    const withDate = {
      ...refreshedAuth,
      expiresAt: new Date(refreshedAuth.expiresAt),
      type: this.getZoomType(),
    };
    await this.storeUserAuth(withDate, userId);

    return withDate;
  };

  authIsExpired = (auth: ExternalAuth) =>
    !auth.expiresAt || auth.expiresAt < new Date();

  userIsAuthorized = async (userId: string) =>
    !!(await this.externalAuth.maybeGetExternalAuth({
      userId,
      type: this.getZoomType(),
    }));

  ensureAuth = async (userId: string) => {
    let auth: ExternalAuth = await this.getUserAuth(userId);
    if (this.authIsExpired(auth)) {
      auth = await this.refreshAuthToken(userId);
    }

    return auth;
  };

  deleteUserAuth = async (userId: string) =>
    this.externalAuth.deleteExternalAuth({ userId, type: this.getZoomType() });
}

@injectable()
export class ZoomAuthFactory {
  constructor(
    @inject("ZoomAuthV1") private v1: ZoomAuth,
    @inject("ZoomAuthV2") private v2: ZoomAuth,
    private externalAuth: ExternalAuthRepository
  ) {}

  getZoomAuthByUserId = async (userId: string) => {
    const auths = await this.externalAuth.getAllExternalAuths(userId);

    if (auths.length === 0) {
      return null;
    }

    const auth = sortBy(auths, [
      (auth) => auth.expiresAt || new Date(0),
      "desc",
    ]).find((auth) => auth.type.startsWith("zoom"));

    if (!auth) {
      return null;
    }

    return this.getZoomAuth(auth.type.replace("zoom", "") as ZoomVersions);
  };

  getZoomAuth = (version: ZoomVersions) => {
    switch (version) {
      case "":
        return this.v1;
      case "V2":
        return this.v2;
    }
  };
}
