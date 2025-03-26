import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";
import { ExtendedRequest } from "../utility/types";

const accessTokenMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.get("authorization")?.split(" ")[1];

  if (!accessToken) {
    res.status(401).json({ message: "No access token provided" });
    return;
  }

  try {
    const { userId, role, active } = jwt.verify(accessToken, config.accessTokenSecret) as JwtPayload;
    req.userId = userId;
    req.role = role;
    req.active = active;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid access token" });
  }
};

export default accessTokenMiddleware;
