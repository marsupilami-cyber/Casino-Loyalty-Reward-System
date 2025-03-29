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
  dbName: process.env.DB_NAME || "test",

  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: Number(process.env.REDIS_PORT) || 6379,

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  accessTokenExpiration: (process.env.ACCESS_TOKEN_EXPIRATION || "10Min") as StringValue,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  refreshTokenExpiration: (process.env.REFRESH_TOKEN_EXPIRATION || "24H") as StringValue,

  kafkaBroker: process.env.KAFKA_BROKER || "localhost:9092",
};
