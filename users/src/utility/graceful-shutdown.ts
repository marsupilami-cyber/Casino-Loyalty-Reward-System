import redisClient from "../config/redis.config";

import { Server } from "http";

import { Server as GrpcServer } from "@grpc/grpc-js";

import { AppDataSource } from "../config/db";
import { producer } from "../config/kafka";
import { logger } from "../config/logger";

export const gracefulShutdown = async (httpServer?: Server, grpcServer?: GrpcServer) => {
  const shutdownTimeout = setTimeout(() => {
    logger.error("Forcefully shutting down after timeout");
    process.exit(1);
  }, 10000);

  logger.info("Shutting down gracefully...");

  grpcServer?.tryShutdown((error) => {
    if (error) {
      logger.warn("gRPC server failed to shut down gracefully, forcing shutdown...");
      grpcServer.forceShutdown();
    } else {
      logger.info("gRPC server closed.");
    }
  });

  httpServer?.close(async () => {
    logger.info("HTTP server closed");
  });

  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info("Database connection closed");
    }

    if (redisClient.isOpen) {
      await redisClient.quit();
      logger.info("Redis connection closed");
    }

    await producer.disconnect();
    logger.info("Kafka connection closed");
    clearTimeout(shutdownTimeout);

    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown: ", error);
    clearTimeout(shutdownTimeout);

    process.exit(1);
  }
};
