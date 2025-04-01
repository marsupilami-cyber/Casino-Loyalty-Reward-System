import { Response, NextFunction } from "express";

import { AppError, AppErrorCode } from "../utility/appError";
import { ExtendedRequest, RolesEnum } from "../utility/types";

const authorizeStaff = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (req.role === RolesEnum.STAFF || req.role === RolesEnum.ADMIN) {
    return next();
  }

  throw new AppError(AppErrorCode.Forbidden, "Access denied. Admin and staff only.");
};

export default authorizeStaff;
