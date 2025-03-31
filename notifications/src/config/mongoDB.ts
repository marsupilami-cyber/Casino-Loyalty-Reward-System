import mongoose from "mongoose";

import { config } from "./config";
import { logger } from "./logger";

if (config.nodeEnv === "development") {
  mongoose.set("debug", true);
}
export const connectMongoose = async () => {
  try {
    const connection = await mongoose.connect(config.mongoURI, {
      dbName: config.mongoDatabase,
      sanitizeFilter: true,
      autoCreate: true,
      maxPoolSize: 10,
      autoIndex: false,
    });
    logger.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error(`Unknown error: ${error}`);
    }
  }
};
