// Original file: src/proto/transaction.proto
import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";

import type {
  TransactionRequest as _transaction_TransactionRequest,
  TransactionRequest__Output as _transaction_TransactionRequest__Output,
} from "../transaction/TransactionRequest";
import type {
  UserResponse as _transaction_UserResponse,
  UserResponse__Output as _transaction_UserResponse__Output,
} from "../transaction/UserResponse";

export interface TransactionServiceClient extends grpc.Client {
  addTransaction(
    argument: _transaction_TransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_UserResponse__Output>,
  ): grpc.ClientUnaryCall;
  addTransaction(
    argument: _transaction_TransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_UserResponse__Output>,
  ): grpc.ClientUnaryCall;
  addTransaction(
    argument: _transaction_TransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_UserResponse__Output>,
  ): grpc.ClientUnaryCall;
  addTransaction(
    argument: _transaction_TransactionRequest,
    callback: grpc.requestCallback<_transaction_UserResponse__Output>,
  ): grpc.ClientUnaryCall;
}

export interface TransactionServiceHandlers extends grpc.UntypedServiceImplementation {
  addTransaction: grpc.handleUnaryCall<_transaction_TransactionRequest__Output, _transaction_UserResponse>;
}

export interface TransactionServiceDefinition extends grpc.ServiceDefinition {
  addTransaction: MethodDefinition<
    _transaction_TransactionRequest,
    _transaction_UserResponse,
    _transaction_TransactionRequest__Output,
    _transaction_UserResponse__Output
  >;
}
