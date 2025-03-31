import { NodeEnvEnum } from "../utility/types";

export const config = {
  nodeEnv: (process.env.NODE_ENV as NodeEnvEnum) || NodeEnvEnum.DEVELOPMENT,
  port: Number(process.env.PORT) || 3002,

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,

  kafkaBroker: process.env.KAFKA_BROKER || "localhost:9092",

  mongoURI: process.env.MONGO_URI || "mongodb://mongo:27017/notifications",
  mongoDatabase: process.env.MONGO_DATABASE || "notifications",
};
