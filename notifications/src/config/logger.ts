import pino from "pino";

import { NodeEnvEnum } from "../utility/types";
import { config } from "./config";

const isDev = config.nodeEnv === NodeEnvEnum.DEVELOPMENT;

export const logger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
