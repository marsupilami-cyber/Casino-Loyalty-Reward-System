import { StatusCodes } from "http-status-codes";

export enum AppErrorCode {
  // General errors (GE)
  Unknown = "GE00",
  Validation = "GE01",
  Internal = "GE02",
  NotFound = "GE03",

  // Auth errors (AU)
  Unauthorized = "AU00",
  Forbidden = "AU01",
  InvalidCredentials = "AU02",
  TokenExpired = "AU03",
  TokenNotProvided = "AU04",
  TokenInvalid = "AU05",
  AccountDeactivated = "AU06",

  // User errors (US)
  UserExists = "US00",
}

const AppCodeToHttpStatus: Record<AppErrorCode, number> = {
  [AppErrorCode.Unknown]: StatusCodes.INTERNAL_SERVER_ERROR,
  [AppErrorCode.Validation]: StatusCodes.BAD_REQUEST,
  [AppErrorCode.Internal]: StatusCodes.INTERNAL_SERVER_ERROR,
  [AppErrorCode.NotFound]: StatusCodes.NOT_FOUND,

  [AppErrorCode.Unauthorized]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.Forbidden]: StatusCodes.FORBIDDEN,
  [AppErrorCode.InvalidCredentials]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.TokenExpired]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.TokenNotProvided]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.TokenInvalid]: StatusCodes.UNAUTHORIZED,
  [AppErrorCode.AccountDeactivated]: StatusCodes.FORBIDDEN,

  [AppErrorCode.UserExists]: StatusCodes.CONFLICT,
};

const AppCodeToMessage: Record<AppErrorCode, string> = {
  [AppErrorCode.Unknown]: "An unknown error occurred.",
  [AppErrorCode.Validation]: "Validation failed.",
  [AppErrorCode.Internal]: "Internal server error.",
  [AppErrorCode.NotFound]: "The requested resource was not found.",
  [AppErrorCode.Unauthorized]: "Unauthorized access.",
  [AppErrorCode.Forbidden]: "Access forbidden. You do not have permission.",
  [AppErrorCode.InvalidCredentials]: "Invalid credentials.",
  [AppErrorCode.TokenExpired]: "Access token has expired.",
  [AppErrorCode.TokenNotProvided]: "No access token provided.",
  [AppErrorCode.TokenInvalid]: "Invalid access token.",
  [AppErrorCode.AccountDeactivated]: "Your account has been deactivated.",
  [AppErrorCode.UserExists]: "A user with this email already exists.",
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
