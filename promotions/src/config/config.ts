import { NodeEnvEnum } from "../utility/types";

export const config = {
  nodeEnv: (process.env.NODE_ENV as NodeEnvEnum) || NodeEnvEnum.DEVELOPMENT,
  port: Number(process.env.PORT) || 3001,
  grpcPort: Number(process.env.GRPC_PORT) || 50051,
  grpcHost: Number(process.env.GRPC_HOST) || "users",

  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 5434,
  dbUser: process.env.DB_USER || "user",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbName: process.env.DB_NAME || "promotions-service",

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,

  kafkaBrokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"],
};
