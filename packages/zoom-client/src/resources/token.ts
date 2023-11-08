import axios from "axios";
import fetch from "node-fetch";

type ZoomAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: string;
};

type AuthResponse = {
  authToken: string;
  refreshToken: string;
  expiresAt: number;
};

class TokenError extends Error {
  constructor(message: string, public data: any) {
    super(message);
  }
}

const createRequestParamString = (params: { [key: string]: string }) => {
  const requestParams = new URLSearchParams();

  for (let param in params) {
    const value = params[param];
    requestParams.set(param, value);
  }

  return requestParams.toString();
};

const isZoomAuthResponse = (data: any): data is ZoomAuthResponse =>
  data && data.access_token && data.refresh_token && data.expires_in;

const handleAuthResponse = (data: any): AuthResponse => {
  if (!isZoomAuthResponse(data)) {
    throw new Error("Failed to authenticate with zoom");
  }

  return {
    authToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: parseInt(data.expires_in, 10) * 1000 + Date.now(),
  };
};

export class TokenRoutes {
  constructor(
    private authHeader: string,
    private apiKey: string,
    private apiSecret: string
  ) {}

  // This function taked from zoom example:
  // https://github.com/zoom/zoomapps-advancedsample-react/blob/main/backend/util/zoom-api.js
  getAuthToken = async (
    authCode: string,
    {
      codeVerifier,
      redirectUrl,
    }: {
      codeVerifier?: string;
      redirectUrl: string;
    }
  ) => {
    const params: {
      [key: string]: string;
    } = {
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: redirectUrl,
    };

    if (typeof codeVerifier === "string") {
      params["code_verifier"] = codeVerifier;
    }

    const tokenRequestParamString = createRequestParamString(params);

    const result = await axios({
      url: `https://zoom.us/oauth/token`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: this.apiKey,
        password: this.apiSecret,
      },
      data: tokenRequestParamString,
    });

    const data = result.data;

    return handleAuthResponse(data);
  };

  refreshAuthToken = async (auth: AuthResponse): Promise<AuthResponse> => {
    const result = await fetch(
      `https://zoom.us/oauth/token?${new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: auth.refreshToken,
      }).toString()}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.authHeader}`,
        },
      }
    );

    const data = await result.json();

    return handleAuthResponse(data);
  };

  revokeAuthToken = async (token: string) => {
    const params: {
      [key: string]: string;
    } = {
      token,
    };

    const tokenRequestParamString = createRequestParamString(params);

    const result = await axios({
      url: `https://zoom.us/oauth/revoke`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Host: "zoom.us",
        Authorization: `Basic ${this.authHeader}`,
      },
      data: tokenRequestParamString,
    });

    const data = result.data;

    return data;
  };
}
