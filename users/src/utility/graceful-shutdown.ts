import redisClient from "../config/redis.config";

import { Server } from "http";

import { AppDataSource } from "../config/db";
import { logger } from "../config/logger";

export const gracefulShutdown = (server: Server) => {
  logger.info("Shutting down gracefully...");

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info("Database connection closed");
      }

      if (redisClient.isOpen) {
        await redisClient.quit();
        logger.info("Redis connection closed");
      }

      process.exit(0);
    } catch (error) {
      logger.error("Error during graceful shutdown: ", error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("Forcefully shutting down after timeout");
    process.exit(1);
  }, 10000);
};
