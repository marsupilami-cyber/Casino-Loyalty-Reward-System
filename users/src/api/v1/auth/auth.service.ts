import redisClient, { getRefreshTokenKey } from "../../../config/redis.config";
import User from "../users/users.model";
import { LoginDto } from "./dto/login.dto";

import bcrypt from "bcryptjs";
import ms from "ms";
import { Repository } from "typeorm";

import { config } from "../../../config/config";
import { AppDataSource } from "../../../config/db";
import { generateToken } from "../../../utility/generateToken";
import { RolesEnum } from "../../../utility/types";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export class AuthService {
  private userRepo: Repository<User>;
  private redisService;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.redisService = redisClient;
  }

  getUserRepo() {
    return this.userRepo;
  }

  getRedisRepo() {
    return this.redisService;
  }

  async register(user: User, role: RolesEnum) {
    const exists = await this.userRepo.existsBy({ email: user.email });
    if (exists) {
      throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    user.password = hashedPassword;
    user.role = role;

    return this.userRepo.save(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new Error("User is not found");
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new Error("Password is wrong");
    }

    const accessToken = generateToken(user, "access");

    const refreshToken = generateToken(user, "refresh");

    const refreshKey = getRefreshTokenKey(user.id);
    await this.redisService.sAdd(refreshKey, refreshToken);

    const expirationSeconds = ms(config.refreshTokenExpiration) / 1000;
    await this.redisService.expire(refreshKey, expirationSeconds);

    return { accessToken, refreshToken };
  }

  async logout(userId: string, token: string) {
    try {
      const refreshKey = getRefreshTokenKey(userId);
      await this.redisService.sRem(refreshKey, token);

      return;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(userId: string, token: string) {
    try {
      const refreshKey = getRefreshTokenKey(userId);
      await this.redisService.sRem(refreshKey, token);

      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: { id: true, role: true, active: true },
      });

      const accessToken = generateToken(user!, "access");

      const refreshToken = generateToken(user!, "refresh");

      await this.redisService.sAdd(refreshKey, refreshToken);

      const expirationSeconds = ms(config.refreshTokenExpiration) / 1000;
      await this.redisService.expire(refreshKey, expirationSeconds);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
