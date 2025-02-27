import { config } from "../utils/env_loader.js";

// DOCS: https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow

/**
 * Generates the Google OAuth URL for user login.
 * This URL directs the user to Google's consent screen.
 * After consenting, Google returns an authorization code,
 * which can be used to obtain user tokens.
 */
export function getGoogleOAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: config.GOOGLE_OAUTH_REDIRECT_URL,
    client_id: config.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const queryString = new URLSearchParams(options).toString();
  return `${rootUrl}?${queryString}`;
}

interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

/**
 * Exchanges an authorization code for Google OAuth tokens.
 * The authorization code is obtained from the Google consent screen
 * (generated by getGoogleOAuthURL).
 */
export async function getGoogleOAuthTokens({
  code,
  res,
}: {
  code: string;
  res: any;
}): Promise<GoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: config.GOOGLE_CLIENT_ID,
    client_secret: config.GOOGLE_CLIENT_SECRET,
    redirect_uri: config.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(values).toString(),
    });
    const data = (await response.json()) as GoogleTokensResult;
    return data;
  } catch (error) {
    console.log(error, "Failed to fetch Google OAuth Tokens");
    throw new Error(error.message);
  }
}
