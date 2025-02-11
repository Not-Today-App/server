import { CookieOptions, Response, Request } from "express";
import { signJwt, verifyJwt } from "./jwt.js";
import { config } from "./env_loader.js";
import { User } from "../schema/user.schema.js";
import { SignOptions } from "jsonwebtoken";

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

const secure = config.NODE_ENV !== "development";

const defaults: CookieOptions = {
  httpOnly: true,
  domain: "localhost", //config.DOMAIN,
  path: "/",
  sameSite: "lax",
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  maxAge: FIFTEEN_MINUTES_IN_MS,
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  maxAge: ONE_YEAR_IN_MS,
});

// ----------------------------------------------------------------------

type CookieParams = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

// Set authentication cookies
export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: CookieParams) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

// Clear authentication cookies
export const clearAuthCookies = (res: Response) =>
  res.clearCookie("accessToken").clearCookie("refreshToken");

// ------------------------------------------------------------------------------

export const reIssueAccessToken = async (user: User, res: Response) => {
  const newAccessToken = signJwt(
    { _id: user._id, role: user.role },
    { expiresIn: config.ACCESS_TOKEN_TTL as SignOptions["expiresIn"] }
  );

  // Set the new access token in the cookies
  res.cookie("accessToken", newAccessToken, getAccessTokenCookieOptions());
  return newAccessToken;
};

export const getUserFromToken = async (
  req: Request,
  res: Response
): Promise<User | null> => {
  // ACCESS TOKEN LOGIC
  const accessToken =
    req.cookies?.accessToken ||
    req.headers["x-access-token"]?.toString().replace(/^Bearer\s/, "");

  if (accessToken) {
    const user = verifyJwt<User>(accessToken);
    if (user) return user;
  }

  // REFRESH TOKEN LOGIC
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const user = verifyJwt<User>(refreshToken);

    if (user) {
      await reIssueAccessToken(user, res);
      return user;
    }
  }
  // No valid tokens found
  return null;
};
