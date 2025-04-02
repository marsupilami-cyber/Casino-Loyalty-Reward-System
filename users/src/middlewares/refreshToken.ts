import { getRefreshTokenKey, redisSlaveClient } from "../config/redis.config";

import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";
import { logger } from "../config/logger";
import { AppError, AppErrorCode } from "../utility/appError";
import { ExtendedRequest } from "../utility/types";

const refreshTokenMiddleware = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.["refreshToken"];
  logger.info(refreshToken);
  if (!refreshToken) {
    throw new AppError(AppErrorCode.TokenNotProvided, "No refresh token provided");
  }

  try {
    const { userId, role, active } = jwt.verify(refreshToken, config.refreshTokenSecret) as JwtPayload;

    const refreshKey = getRefreshTokenKey(userId);

    const exists = await redisSlaveClient.sIsMember(refreshKey, refreshToken);
    if (!exists) {
      throw new AppError(AppErrorCode.TokenInvalid, "Refresh token is not valid");
    }

    req.userId = userId;
    req.role = role;
    req.active = active;

    next();
  } catch (error) {
    logger.error(error);
    throw new AppError(AppErrorCode.TokenInvalid, "Refresh token is not valid");
  }
};

export default refreshTokenMiddleware;
