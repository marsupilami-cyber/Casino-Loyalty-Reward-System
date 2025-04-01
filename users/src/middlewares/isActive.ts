import { Response, NextFunction } from "express";

import { AppError, AppErrorCode } from "../utility/appError";
import { ExtendedRequest } from "../utility/types";

const isActive = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (!req.active) {
    throw new AppError(AppErrorCode.AccountDeactivated);
  }

  next();
};

export default isActive;
