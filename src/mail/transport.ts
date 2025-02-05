import nodemailer, { Transporter } from "nodemailer";
import { config } from "../utils/env_loader.js";

const createDevelopmentConfig = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  } catch (error) {
    console.error("Error creating Ethereal account:", error);
    throw error;
  }
};

// Function to create the production SMTP configuration
const createProductionConfig = () => ({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
});

let transport: nodemailer.Transporter | null = null;

export const getTransport = async () => {
  if (transport) return transport;

  let transportConfig;

  config.NODE_ENV === "production"
    ? (transportConfig = createProductionConfig())
    : (transportConfig = await createDevelopmentConfig());

  transport = nodemailer.createTransport(transportConfig);
  return transport;
};
