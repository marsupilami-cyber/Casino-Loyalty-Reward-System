import { createClient } from "redis";

import { config } from "./config";
import { logger } from "./logger";

export const redisMasterClient = createClient({
  socket: {
    host: config.redisMasterHost,
    port: config.redisMasterPort,
  },
});

export const redisSlaveClient = createClient({
  socket: {
    host: config.redisSlaveHost,
    port: config.redisSlavePort,
  },
});

export const connectRedis = async () => {
  redisMasterClient.on("connect", () => {
    logger.info("Redis master client connected");
  });

  redisMasterClient.on("error", (err) => {
    throw Error("Redis master error " + err.message);
  });

  await redisMasterClient.connect();

  redisSlaveClient.on("connect", () => {
    logger.info("Redis slave client connected");
  });

  redisSlaveClient.on("error", (err) => {
    throw Error("Redis slave error " + err.message);
  });

  await redisSlaveClient.connect();
};

export function getRefreshTokenKey(userId: string) {
  return `${userId}:refresh_tokens`;
}
