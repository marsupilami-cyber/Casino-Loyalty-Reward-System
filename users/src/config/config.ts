import { NodeEnvEnum } from "../utility/types";

export const config = {
  nodeEnv: (process.env.NODE_ENV as NodeEnvEnum) || NodeEnvEnum.DEVELOPMENT,
  port: process.env.PORT,
  dbHost: process.env.DB_HOST as string,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
};
