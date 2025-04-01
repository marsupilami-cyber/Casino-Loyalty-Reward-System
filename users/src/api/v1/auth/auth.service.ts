import redisClient, { getRefreshTokenKey } from "../../../config/redis.config";
import User from "../users/users.model";
import { LoginInputDto } from "./dto/login.dto";
import { RegisterInputDto } from "./dto/user.dto";

import bcrypt from "bcryptjs";
import ms from "ms";
import { Repository } from "typeorm";

import { config } from "../../../config/config";
import { AppDataSource } from "../../../config/db";
import { KafkaEvent, KafkaTopic, producer } from "../../../config/kafka";
import { AppError, AppErrorCode } from "../../../utility/appError";
import { generateToken } from "../../../utility/generateToken";
import { RolesEnum } from "../../../utility/types";

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

  async register(userDto: RegisterInputDto, role: RolesEnum) {
    const exists = await this.userRepo.existsBy({ email: userDto.email });
    if (exists) {
      throw new AppError(AppErrorCode.UserExists);
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 12);

    const user = new User();
    user.email = userDto.email;
    user.password = hashedPassword;
    user.role = role;

    await this.userRepo.save(user);

    if (role === RolesEnum.PLAYER) {
      const eventData = {
        user_id: user.id,
        event_type: KafkaEvent.PlayerRegistered,
      };

      await producer.send({
        topic: KafkaTopic.Player,
        messages: [{ value: JSON.stringify(eventData) }],
      });
    }

    return user;
  }

  async login(loginDto: LoginInputDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new AppError(AppErrorCode.NotFound, "User is not found");
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new AppError(AppErrorCode.InvalidCredentials);
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

      const user = await this.userRepo.findOneOrFail({
        where: { id: userId },
        select: { id: true, role: true, active: true },
      });

      const accessToken = generateToken(user, "access");

      const refreshToken = generateToken(user, "refresh");

      await this.redisService.sAdd(refreshKey, refreshToken);

      const expirationSeconds = ms(config.refreshTokenExpiration) / 1000;
      await this.redisService.expire(refreshKey, expirationSeconds);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
