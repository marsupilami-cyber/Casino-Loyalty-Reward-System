import { connectRedis } from "./config/redis.config";

import cookieParser from "cookie-parser";
import express from "express";
import { Server } from "http";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import * as swaggerUI from "swagger-ui-express";

import { config } from "./config/config";
import { connectDatabase } from "./config/db";
import { connectKafka } from "./config/kafka";
import { logger } from "./config/logger";
import { swaggerSpecV1 } from "./config/swagger";
import routes from "./routes";
import { gracefulShutdown } from "./utility/graceful-shutdown";

let server: Server;

const startServer = async () => {
  const app = express();
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

  try {
    await Promise.all([connectDatabase(), connectRedis(), connectKafka()]);
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
