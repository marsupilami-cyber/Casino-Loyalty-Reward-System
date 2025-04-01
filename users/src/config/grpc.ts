import TransactionGrpcController from "../api/v1/transactions/tansactions.grpc.controller";

import path from "path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import { ProtoGrpcType } from "../protogen/transaction";
import { config } from "./config";
import { logger } from "./logger";

export const startGrpcServer = async () => {
  const PROTO_PATH = path.resolve(__dirname, "../proto/transaction.proto");
  const packageDefinition = await protoLoader.load(PROTO_PATH);
  const transactionPackage = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

  const grpcServer = new grpc.Server();

  grpcServer.addService(transactionPackage.transaction.TransactionService.service, new TransactionGrpcController());

  grpcServer.bindAsync(`0.0.0.0:${config.grpcPort}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      logger.error("Error starting gRPC server:", error);
    }
    logger.info(`gRPC server running on port ${port}`);
  });
  return grpcServer;
};
