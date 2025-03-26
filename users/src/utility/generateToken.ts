import User from "../api/v1/users/users.model";

import jwt from "jsonwebtoken";

import { config } from "../config/config";

export const generateToken = (user: User, token: "refresh" | "access") => {
  const tokenSecret = token === "access" ? config.accessTokenSecret : config.refreshTokenSecret;
  const expirationTime = token === "access" ? config.accessTokenExpiration : config.refreshTokenExpiration;
  return jwt.sign({ userId: user.id, role: user.role, active: user.active }, tokenSecret, {
    expiresIn: expirationTime,
  });
};
