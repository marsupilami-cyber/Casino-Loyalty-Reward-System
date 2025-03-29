// Original file: src/proto/transaction.proto

export const TransactionType = {
  CREDIT: 0,
  DEBIT: 1,
} as const;

export type TransactionType =
  | 'CREDIT'
  | 0
  | 'DEBIT'
  | 1

export type TransactionType__Output = typeof TransactionType[keyof typeof TransactionType]
