import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { logger } from "../config/logger";
import { AppError, AppErrorCode, AppValidationError } from "../utility/appError";
import { ApiError } from "../utility/types";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppValidationError) {
    const response: ApiError = {
      success: false,
      message: err.message,
      error: {
        code: err.code,
        details: err.details,
      },
    };

    res.status(err.httpStatusCode).json(response);
    return;
  }

  if (err instanceof AppError) {
    const response: ApiError = {
      success: false,
      message: err.message,
      error: {
        code: err.code,
      },
    };

    res.status(err.httpStatusCode).json(response);
    return;
  }

  logger.error("Unhandled error:", err);

  const response: ApiError = {
    success: false,
    message: err.message,
    error: {
      code: AppErrorCode.Unknown,
    },
  };

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
};
