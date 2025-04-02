import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";
import { logger } from "../config/logger";
import { AppError, AppErrorCode } from "../utility/appError";
import { ExtendedRequest } from "../utility/types";

const accessTokenMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.get("authorization")?.split(" ")[1];
  if (!accessToken) {
    throw new AppError(AppErrorCode.TokenNotProvided);
  }

  try {
    const { userId, role, active } = jwt.verify(accessToken, config.accessTokenSecret) as JwtPayload;
    req.userId = userId;
    req.role = role;
    req.active = active;

    next();
  } catch (error) {
    throw new AppError(AppErrorCode.TokenInvalid);
  }
};

export default accessTokenMiddleware;
