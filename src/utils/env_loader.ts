import dotenv from "dotenv";
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
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
