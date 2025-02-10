import express from "express";
import {
  getGoogleOAuthTokens,
  getGoogleOAuthURL,
} from "./google_utils.oauth.js";
import jwt from "jsonwebtoken";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";
import { UserModel } from "../schema/user.schema.js";
import { config } from "../utils/env_loader.js";

interface GoogleUserPayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export function setupGoogleOAuthRoutes(app: express.Application) {
  // Redirect to Google OAuth URL
  app.get("/auth/google", (_, res) => {
    const url = getGoogleOAuthURL();
    res.redirect(url);
  });

  // Handle Google OAuth callback
  app.get("/api/sessions/oauth/google", async (req, res) => {
    // get the code from query string
    const code = req.query.code as string;

    try {
      // get tokens w/ code
      const { id_token, access_token } = await getGoogleOAuthTokens({
        code,
        res,
      });

      const googleUser = jwt.decode(id_token) as GoogleUserPayload;

      Assert.isTrue(
        !!googleUser || !!googleUser.email_verified,
        "google account is not verified",
        AppErrors.GOOGLE_ACCOUNT_NOT_VERIFIED
      );

      // upsert user
      const user = await UserModel.findOneAndUpdate(
        { email: googleUser.email },
        {
          email: googleUser.email,
          username: googleUser.name,
          picture: googleUser.picture,
          isEmailVerified: true,
        },
        {
          upsert: true,
          new: true,
        }
      );

      res.redirect(config.SERVER_URL);

      // TODO: create a session

      // TODO: create access and refresh tokens

      // TODO: Set cookies

      // redirect back to client
    } catch (error) {
      console.log(error, "Failed to authorize Google user");
      return res.redirect(`${config.SERVER_URL}/oauth/error`);
    }
  });
}
