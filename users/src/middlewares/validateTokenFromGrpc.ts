import jwt, { JwtPayload } from "jsonwebtoken";

import { Metadata } from "@grpc/grpc-js";

import { config } from "../config/config";

export const validateAuthorization = (metadata: Metadata): boolean => {
  const token = metadata.get("authorization")[0];
  if (!token) {
    return false;
  }
  try {
    let accessToken;
    if (typeof token === "string") {
      const parts = token.split(" ");
      accessToken = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;
    }
    if (!accessToken) {
      return false;
    }
    jwt.verify(accessToken, config.accessTokenSecret) as JwtPayload;
    return true;
  } catch (err) {
    return false;
  }
};
