import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";

export const authenticateWebSocket = (accessToken: string) => {
  try {
    const user = jwt.verify(accessToken, config.accessTokenSecret) as JwtPayload;
    return user;
  } catch (error) {
    return null;
  }
};
