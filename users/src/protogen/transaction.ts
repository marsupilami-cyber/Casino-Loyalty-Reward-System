import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { TransactionServiceClient as _transaction_TransactionServiceClient, TransactionServiceDefinition as _transaction_TransactionServiceDefinition } from './transaction/TransactionService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  transaction: {
    TransactionRequest: MessageTypeDefinition
    TransactionService: SubtypeConstructor<typeof grpc.Client, _transaction_TransactionServiceClient> & { service: _transaction_TransactionServiceDefinition }
    TransactionType: EnumTypeDefinition
    UserResponse: MessageTypeDefinition
  }
}

