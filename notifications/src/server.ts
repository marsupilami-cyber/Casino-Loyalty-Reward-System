import { config } from "./config/config";
import { connectKafka } from "./config/kafka";
import { logger } from "./config/logger";
import { connectMongoose } from "./config/mongoDB";
import consumeNotifications from "./kafka/consumer";
import { gracefulShutdown } from "./utility/graceful-shutdown";
import { setupWebSocket } from "./websocket/websocket";

const startServer = async () => {
  try {
    await Promise.all([connectMongoose(), connectKafka()]);

    await consumeNotifications();

    const wss = setupWebSocket();

    const PORT = config.port;
    logger.info(`WebSocket server running on port ${PORT}`);

    process.on("SIGINT", async () => await gracefulShutdown(wss));
    process.on("SIGTERM", async () => await gracefulShutdown(wss));
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
