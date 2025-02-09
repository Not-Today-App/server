import dotenv from "dotenv";
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  SERVER_URL: process.env.SERVER_URL,

  PRIVATE_KEY: process.env.PRIVATE_KEY,
  PUBLIC_KEY: process.env.PUBLIC_KEY,

  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

export function validateConfigVariables() {
  let anyKeyMissing = false;

  Object.keys(config).forEach((key) => {
    if (!config[key]) {
      console.warn(`Environment variable ${key} is missing or undefined.`);
      anyKeyMissing = true;
    }
  });

  if (anyKeyMissing) {
    throw new Error("MISSING ENVs, CAN'T START THE SERVER");
  }
}
