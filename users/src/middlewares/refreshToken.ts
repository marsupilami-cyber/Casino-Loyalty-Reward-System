import redisClient, { getRefreshTokenKey } from "../config/redis.config";

import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";
import { logger } from "../config/logger";
import { ExtendedRequest } from "../utility/types";

const refreshTokenMiddleware = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.["refreshToken"];
  logger.info(refreshToken);
  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }

  try {
    const { userId, role, active } = jwt.verify(refreshToken, config.refreshTokenSecret) as JwtPayload;

    const refreshKey = getRefreshTokenKey(userId);

    const exists = await redisClient.sIsMember(refreshKey, refreshToken);
    if (!exists) {
      res.status(401).json({ message: "Refresh token is not valid" });
      return;
    }

    req.userId = userId;
    req.role = role;
    req.active = active;

    next();
  } catch (error) {
    logger.error(error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export default refreshTokenMiddleware;
