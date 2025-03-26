import { createClient } from "redis";

import { config } from "./config";
import { logger } from "./logger";

const redisClient = createClient({
  socket: {
    host: config.redisHost,
    port: config.redisPort,
  },
});

export const connectRedis = async () => {
  redisClient.on("connect", () => {
    logger.info("Redis client connected");
  });

  redisClient.on("error", (err) => {
    throw Error("Redis error " + err.message);
  });

  await redisClient.connect();
};

export function getRefreshTokenKey(userId: string) {
  return `${userId}:refresh_tokens`;
}

export default redisClient;
