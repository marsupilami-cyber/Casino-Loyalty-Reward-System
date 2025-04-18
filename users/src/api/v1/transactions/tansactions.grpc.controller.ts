import { AddTransactionDto } from "./dto/addTransaction.dto";
import { TransactionService } from "./transactions.service";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import * as grpc from "@grpc/grpc-js";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

import { validateAuthorization } from "../../../middlewares/validateTokenFromGrpc";
import { TransactionRequest } from "../../../protogen/transaction/TransactionRequest";
import { TransactionServiceHandlers } from "../../../protogen/transaction/TransactionService";
import { UserResponse } from "../../../protogen/transaction/UserResponse";

const transactionService = new TransactionService();

class TransactionGrpcController implements TransactionServiceHandlers {
  [name: string]: grpc.UntypedHandleCall;

  async addTransaction(call: ServerUnaryCall<TransactionRequest, UserResponse>, callback: sendUnaryData<UserResponse>) {
    if (!validateAuthorization(call.metadata)) {
      return callback(
        {
          code: grpc.status.UNAUTHENTICATED,
          message: "Invalid or missing authorization token",
        },
        null,
      );
    }

    const transanctionData = plainToInstance(AddTransactionDto, call.request);
    const errors = await validate(transanctionData);
    if (errors.length > 0) {
      return callback(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: JSON.stringify(errors.map(({ constraints }) => constraints!)),
        },
        null,
      );
    }

    try {
      const transaction = await transactionService.addTransaction(transanctionData);

      callback(null, { id: transaction.userId, balance: transaction.balance });
    } catch (error) {
      if (error instanceof Error) {
        return callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: error.message || "Internal server error",
          },
          null,
        );
      }
    }
  }
}

export default TransactionGrpcController;
