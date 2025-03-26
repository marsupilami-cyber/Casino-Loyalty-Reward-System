import Transaction from "../api/v1/transactions/transactions.model";
import User from "../api/v1/users/users.model";

import "reflect-metadata";
import { DataSource } from "typeorm";

import { NodeEnvEnum } from "../utility/types";
import { config } from "./config";
import { logger } from "./logger";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: true,
  logging: config.nodeEnv === NodeEnvEnum.DEVELOPMENT,
  entities: [User, Transaction],
  migrations: [],
  subscribers: [],
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("connect to database: " + error.message);
    }
    throw error;
  }
};
