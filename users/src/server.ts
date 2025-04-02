import { connectRedis } from "./config/redis.config";

import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { Server } from "http";
import "reflect-metadata";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import * as swaggerUI from "swagger-ui-express";

import { Server as GrpcServer } from "@grpc/grpc-js";

import { config } from "./config/config";
import { initDb } from "./config/db";
import { startGrpcServer } from "./config/grpc";
import { connectKafka } from "./config/kafka";
import { logger } from "./config/logger";
import { swaggerSpecV1 } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";
import { gracefulShutdown } from "./utility/graceful-shutdown";

let server: Server;
let grpcServer: GrpcServer;

const startServer = async () => {
  const app = express();

  app.use(helmet());
  app.disable("x-powered-by");
  app.set("trust proxy", true);

  app.use(express.json());
  app.use(cookieParser());

  const theme = new SwaggerTheme();
  const darkStyle = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);
  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpecV1, {
      customCss: darkStyle,
      swaggerOptions: { withCredentials: true },
    }),
  );
  app.use("/", routes);
  app.use(errorHandler);

  try {
    await Promise.all([initDb(), connectRedis(), connectKafka()]);
    grpcServer = await startGrpcServer();
  } catch (error) {
    logger.error(error);
    gracefulShutdown(server, grpcServer);
  }
  try {
    const PORT = config.port;

    server = app.listen(PORT, (error) => {
      if (error) {
        throw error;
      }
      logger.info(`Server running on ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    gracefulShutdown(server, grpcServer);
  }
};

process.on("SIGINT", () => gracefulShutdown(server, grpcServer));
process.on("SIGTERM", () => gracefulShutdown(server, grpcServer));

startServer();
