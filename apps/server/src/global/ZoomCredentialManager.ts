import { injectable } from "tsyringe";
import { Settings } from "./Settings";

export type ZoomVersions = "" | "V2";

@injectable()
export class ZoomCredentialManager {
  private currentVersion: ZoomVersions = "";
  private credentials: {
    [key in ZoomVersions]: {
      id: string;
      secret: string;
      verificationSecret: string;
    };
  };
  constructor(settings: Settings) {
    const v1Id = settings.getSetting("zoomId");
    const v1Secret = settings.getSetting("zoomSecret");
    const v1VerificationSecret = settings.getSetting("zoomVerificationSecret");
    const v2Id = settings.getSetting("zoomIdV2");
    const v2Secret = settings.getSetting("zoomSecretV2");
    const v2VerificationSecret = settings.getSetting(
      "zoomVerificationSecretV2"
    );

    if (
      !v1Id ||
      !v1Secret ||
      !v1VerificationSecret ||
      !v2Id ||
      !v2Secret ||
      !v2VerificationSecret
    ) {
      const missingCredentials = Object.entries({
        v1Id,
        v1Secret,
        v1VerificationSecret,
        v2Id,
        v2Secret,
        v2VerificationSecret,
      })
        .filter((v) => !v[1])
        .map((v) => v[0]);

      throw new Error(
        "Zoom credentials not set: " +
          missingCredentials.join(", ") +
          ". Please set them in the settings."
      );
    }

    this.credentials = {
      "": {
        id: v1Id,
        secret: v1Secret,
        verificationSecret: v1VerificationSecret,
      },
      V2: {
        id: v2Id,
        secret: v2Secret,
        verificationSecret: v2VerificationSecret,
      },
    };
  }
  getCredentials = () => {
    return this.credentials[this.currentVersion];
  };

  setVersion = (version: ZoomVersions) => {
    this.currentVersion = version;
  };

  getCurrentVersion = () => {
    return this.currentVersion;
  };

  getCredentialsForVersion = (version: ZoomVersions) => {
    return this.credentials[version];
  };
}
