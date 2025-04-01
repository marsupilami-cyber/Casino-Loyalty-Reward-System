import { StatusCodes } from "http-status-codes";

export enum AppErrorCode {
  // General errors (GE)
  Unknown = "GE00",
  Validation = "GE01",
  Internal = "GE02",
  NotFound = "GE03",
  GrpcRequestFailed = "GE04",
  KafkaProducerError = "GE05",

  // Auth errors (AU)
  Unauthorized = "AU00",
  Forbidden = "AU01",
  InvalidCredentials = "AU02",
  TokenExpired = "AU03",
  TokenNotProvided = "AU04",
  TokenInvalid = "AU05",
  AccountDeactivated = "AU06",

  // Promotion errors (PR)
  PromotionExists = "PR00",
  PromotionNotActive = "PR01",
  PromotionExpired = "PR02",
  PromotionClaimed = "PR03",
}

const AppCodeToHttpStatus: Record<AppErrorCode, number> = {
  [AppErrorCode.Unknown]: StatusCodes.INTERNAL_SERVER_ERROR,
  [AppErrorCode.Validation]: StatusCodes.BAD_REQUEST,
  [AppErrorCode.Internal]: StatusCodes.INTERNAL_SERVER_ERROR,
  [AppErrorCode.NotFound]: StatusCodes.NOT_FOUND,
  [AppErrorCode.GrpcRequestFailed]: StatusCodes.BAD_GATEWAY,
  [AppErrorCode.KafkaProducerError]: StatusCodes.BAD_GATEWAY,

  [AppErrorCode.Unauthorized]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.Forbidden]: StatusCodes.FORBIDDEN,
  [AppErrorCode.InvalidCredentials]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.TokenExpired]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.TokenNotProvided]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.TokenInvalid]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.AccountDeactivated]: StatusCodes.FORBIDDEN,

  [AppErrorCode.PromotionExists]: StatusCodes.CONFLICT,
  [AppErrorCode.PromotionNotActive]: StatusCodes.BAD_REQUEST,
  [AppErrorCode.PromotionExpired]: StatusCodes.BAD_REQUEST,
  [AppErrorCode.PromotionClaimed]: StatusCodes.BAD_REQUEST,
};

const AppCodeToMessage: Record<AppErrorCode, string> = {
  [AppErrorCode.Unknown]: "An unknown error occurred.",
  [AppErrorCode.Validation]: "Validation failed.",
  [AppErrorCode.Internal]: "Internal server error.",
  [AppErrorCode.NotFound]: "The requested resource was not found.",
  [AppErrorCode.GrpcRequestFailed]: "Failed to process gRPC request.",
  [AppErrorCode.KafkaProducerError]: "Failed to send notification to Kafka topic",

  [AppErrorCode.Unauthorized]: "Unauthorized access.",
  [AppErrorCode.Forbidden]: "Access forbidden. You do not have permission.",
  [AppErrorCode.InvalidCredentials]: "Invalid credentials.",
  [AppErrorCode.TokenExpired]: "JWT token has expired.",
  [AppErrorCode.TokenNotProvided]: "No access token provided.",
  [AppErrorCode.TokenInvalid]: "Invalid access token.",
  [AppErrorCode.AccountDeactivated]: "Your account has been deactivated.",

  [AppErrorCode.PromotionExists]: "Promotion already exists in selected range.",
  [AppErrorCode.PromotionNotActive]: "Promotion is not active.",
  [AppErrorCode.PromotionExpired]: "Promotion has expired.",
  [AppErrorCode.PromotionClaimed]: "Promotion has already been claimed.",
};

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode = AppErrorCode.Unknown,
    message: string = AppCodeToMessage[code],
    public readonly httpStatusCode: number = AppCodeToHttpStatus[code],
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AppValidationError extends AppError {
  constructor(public readonly details?: Record<string, string>[]) {
    super(AppErrorCode.Validation);
  }
}
