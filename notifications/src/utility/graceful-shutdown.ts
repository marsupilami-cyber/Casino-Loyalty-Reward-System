import mongoose from "mongoose";
import { WebSocketServer } from "ws";

import { consumer } from "../config/kafka";
import { logger } from "../config/logger";

export const gracefulShutdown = async (wss: WebSocketServer) => {
  logger.info("Shutting down gracefully...");

  const shutdownTimeout = setTimeout(() => {
    logger.error("Forcefully shutting down after timeout");
    process.exit(1);
  }, 10000);

  wss.clients.forEach((client) => {
    client.close();
    logger.info("Closing WebSocket client");
  });

  try {
    await consumer.disconnect();
    logger.info("Kafka consumer connection closed");

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      logger.info("MongoDB connection closed");
    }

    clearTimeout(shutdownTimeout);
    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown: ", error);
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};
