import { Server } from "http";

import { consumer } from "../config/kafka";
import { logger } from "../config/logger";

export const gracefulShutdown = (server: Server) => {
  logger.info("Shutting down gracefully...");

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      await consumer.disconnect();
      logger.info("Kafka consumer connection closed");

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
