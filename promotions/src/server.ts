import assignPromotionConsumer from "./api/v1/promotions/kafka/assignPromotionConsumer";

import express from "express";
import { Server } from "http";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import * as swaggerUI from "swagger-ui-express";

import routes from "../src/routes";
import { config } from "./config/config";
import { connectDatabase } from "./config/db";
import { waitForGrpcClient } from "./config/grpc";
import { connectKafka } from "./config/kafka";
import { logger } from "./config/logger";
import { swaggerSpecV1 } from "./config/swagger";
import { gracefulShutdown } from "./utility/graceful-shutdown";

let server: Server;

const startServer = async () => {
  const app = express();
  app.use(express.json());

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
    await Promise.all([connectDatabase(), connectKafka()]);
    await assignPromotionConsumer();
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
