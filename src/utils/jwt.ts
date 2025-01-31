import { config } from "./env_loader.js";
import jwt from "jsonwebtoken";

const privateKey = Buffer.from(config.PRIVATE_KEY, "base64").toString("ascii");

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}
