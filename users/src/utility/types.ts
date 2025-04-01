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

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  error: {
    code: string;
    details?: Record<string, string>[];
  };
}
