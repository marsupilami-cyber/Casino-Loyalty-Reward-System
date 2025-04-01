import assignPromotionConsumer from "./api/v1/promotions/kafka/assignPromotionConsumer";

import express from "express";
import helmet from "helmet";
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
import { errorHandler } from "./middlewares/errorHandler";
import { gracefulShutdown } from "./utility/graceful-shutdown";

let server: Server;

const startServer = async () => {
  const app = express();

  app.use(helmet());
  app.disable("x-powered-by");
  app.set("trust proxy", true);

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
  app.use(errorHandler);

  try {
    await Promise.all([connectDatabase(), connectKafka(), waitForGrpcClient()]);
    await assignPromotionConsumer();
  } catch (error) {
    logger.error(error);
    await gracefulShutdown(server);
  }
  try {
    const PORT = config.port;
    server = app.listen(PORT, async () => {
      logger.info(`Server running on ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    await gracefulShutdown(server);
  }
};

process.on("SIGINT", async () => await gracefulShutdown(server));
process.on("SIGTERM", async () => await gracefulShutdown(server));

startServer();
