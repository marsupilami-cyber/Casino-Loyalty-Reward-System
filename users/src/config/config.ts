import { StringValue } from "ms";

import { NodeEnvEnum } from "../utility/types";

export const config = {
  nodeEnv: (process.env.NODE_ENV as NodeEnvEnum) || NodeEnvEnum.DEVELOPMENT,
  port: Number(process.env.PORT) || 3000,
  grpcPort: Number(process.env.GRPC_PORT) || 50051,

  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 5433,
  dbUser: process.env.DB_USER || "user",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbName: process.env.DB_NAME || "users-service",

  redisMasterHost: process.env.REDIS_HOST || "localhost",
  redisMasterPort: Number(process.env.REDIS_PORT) || 6379,
  redisSlaveHost: process.env.REDIS_SLAVE_HOST || "localhost",
  redisSlavePort: Number(process.env.REDIS_SLAVE_PORT) || 6379,

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  accessTokenExpiration: (process.env.ACCESS_TOKEN_EXPIRATION || "10Min") as StringValue,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  refreshTokenExpiration: (process.env.REFRESH_TOKEN_EXPIRATION || "24H") as StringValue,

  kafkaBrokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"],
};
