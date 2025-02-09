import Redis from "ioredis";
import { config } from "./env_loader.js";

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient =
      config.REDIS_HOST && config.REDIS_PORT
        ? new Redis({
            host: config.REDIS_HOST,
            port: Number(config.REDIS_PORT) || 6379,
            username: config.REDIS_USERNAME || "default",
            password: config.REDIS_PASSWORD,
            lazyConnect: true,
          })
        : new Redis({
            port: 5002,
            host: "localhost",
            lazyConnect: true,
          });

    // Handle connection errors
    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    // Connect to Redis (only once)
    redisClient.connect().then(() => {
      console.log("Connected to Redis");
    });
  }

  return redisClient;
};
