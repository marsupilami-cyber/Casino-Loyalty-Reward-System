import { Request } from "express";

export enum NodeEnvEnum {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum RolesEnum {
  PLAYER = "PLAYER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export enum TransactionTypesEnum {
  CREDIT = 0,
  DEBIT = 1,
}

export interface ExtendedRequest extends Request {
  userId?: string;
  role?: string;
  active?: boolean;
}
