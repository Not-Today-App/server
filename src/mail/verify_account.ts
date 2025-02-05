import Mail from "nodemailer/lib/mailer";
import { config } from "../utils/env_loader.js";

interface VerificationEmailInput {
  username: string;
  email: string;
}

const getFromEmail = () =>
  config.NODE_ENV === "development" ? "test@example.com" : config.SMTP_USER;

export const generateVerificationEmail = (
  creds: VerificationEmailInput
): Mail.Options => ({
  from: getFromEmail(),
  to: creds.email, // list of receivers
  subject: `Welcome to Not Today ${creds.username}`,
  html: "<b>Please click the link below to verify your account</b> <a href='http://google.com' target='_blank'> Register Account</a>",
});
