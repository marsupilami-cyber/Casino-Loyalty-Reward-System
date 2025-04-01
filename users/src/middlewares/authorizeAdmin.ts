import { Response, NextFunction } from "express";

import { AppError, AppErrorCode } from "../utility/appError";
import { ExtendedRequest, RolesEnum } from "../utility/types";

const authorizeAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (req.role !== RolesEnum.ADMIN) {
    throw new AppError(AppErrorCode.Forbidden, "Access denied. Admins only.");
  }

  next();
};

export default authorizeAdmin;
