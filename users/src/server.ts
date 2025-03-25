import express from "express";
import { Server } from "http";

import { config } from "./config/config";
import { connectDatabase } from "./config/db";
import { logger } from "./config/logger";
import { gracefulShutdown } from "./utility/graceful-shutdown";

let server: Server;

const startServer = async () => {
  const app = express();
  app.use(express.json());

  try {
    await Promise.all([connectDatabase()]);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
  try {
    const PORT = config.port;
    server = app.listen(PORT, async () => {
      logger.info(`Server running on ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown(server));
process.on("SIGTERM", () => gracefulShutdown(server));

startServer();
