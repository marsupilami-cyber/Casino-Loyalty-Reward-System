import path from "path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import { ProtoGrpcType } from "../protogen/transaction";
import { config } from "./config";
import { logger } from "./logger";

const PROTO_PATH = path.resolve(__dirname, "../proto/transaction.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const transactionPackage = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export const grpcClient = new transactionPackage.transaction.TransactionService(
  `${config.grpcHost}:${config.grpcPort}`,
  grpc.credentials.createInsecure(),
);

export const waitForGrpcClient = (retries: number = 3) => {
  let attempts = 0;

  const tryConnect = () => {
    grpcClient.waitForReady(Date.now() + 5000, (error) => {
      if (error) {
        if (attempts < retries) {
          attempts++;
          logger.warn(`gRPC client not ready, retrying attempt ${attempts}...`);
          setTimeout(tryConnect, 5000);
        } else {
          logger.error("gRPC client failed to connect after 3 attempts:", error);
        }
      } else {
        logger.info("gRPC client is ready");
      }
    });
  };

  tryConnect();
};
