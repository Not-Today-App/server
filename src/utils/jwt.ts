import { config } from "./env_loader.js";
import jwt from "jsonwebtoken";

const privateKey = Buffer.from(config.PRIVATE_KEY, "base64").toString("ascii");
const publicKey = Buffer.from(config.PUBLIC_KEY, "base64").toString("ascii");

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
