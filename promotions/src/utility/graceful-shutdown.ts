import { Server } from "http";

import { AppDataSource } from "../config/db";
import { consumer, producer } from "../config/kafka";
import { logger } from "../config/logger";

export const gracefulShutdown = async (server?: Server) => {
  const shutdownTimeout = setTimeout(() => {
    logger.error("Forcefully shutting down after timeout");
    process.exit(1);
  }, 10000);

  logger.info("Shutting down gracefully...");

  server?.close(async () => {
    logger.info("HTTP server closed");
  });
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info("Database connection closed");
    }

    await producer.disconnect();
    logger.info("Kafka producer connection closed");

    await consumer.disconnect();
    logger.info("Kafka consumer connection closed");

    clearTimeout(shutdownTimeout);

    process.exit(0);
  } catch (error) {
    logger.error("Forcefully shutting down");

    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};
