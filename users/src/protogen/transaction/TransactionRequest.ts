// Original file: src/proto/transaction.proto

import type { TransactionType as _transaction_TransactionType, TransactionType__Output as _transaction_TransactionType__Output } from '../transaction/TransactionType';

export interface TransactionRequest {
  'userId'?: (string);
  'amount'?: (number | string);
  'transactionType'?: (_transaction_TransactionType);
  'description'?: (string);
  'additionalData'?: (string);
}

export interface TransactionRequest__Output {
  'userId'?: (string);
  'amount'?: (number);
  'transactionType'?: (_transaction_TransactionType__Output);
  'description'?: (string);
  'additionalData'?: (string);
}
