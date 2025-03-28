import { Request } from "express";

export enum NodeEnvEnum {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}
export enum RolesEnum {
  PLAYER = "PLAYER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export interface ExtendedRequest extends Request {
  userId?: string;
  role?: string;
  active?: boolean;
}

export enum PromotionType {
  PLAYER_REGISTERED = "PLAYER_REGISTERED",
  VIP = "VIP_PROMOTION",
  BONUS = "BONUS",
}
