import { CreatePromotionDto } from "./dto/createPromotions.dto";
import { GetPromotionsDto } from "./dto/getPromotions.dto";
import PlayerPromotion from "./models/playerPromotions.model";
import Promotion from "./models/promotions.model";

import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";

import * as grpc from "@grpc/grpc-js";

import { AppDataSource } from "../../../config/db";
import { grpcClient } from "../../../config/grpc";
import { logger } from "../../../config/logger";
import { TransactionRequest } from "../../../protogen/transaction/TransactionRequest";
import { AppError, AppErrorCode } from "../../../utility/appError";
import { PromotionType, uniquePromotionTypes } from "../../../utility/types";
import { sendNotificationProducer } from "./kafka/sendNotification";

export class PromotionService {
  private promotionRepo: Repository<Promotion>;
  private playerPromotionRepo: Repository<PlayerPromotion>;

  constructor() {
    this.promotionRepo = AppDataSource.getRepository(Promotion);
    this.playerPromotionRepo = AppDataSource.getRepository(PlayerPromotion);
  }

  async createPromotion(promotionData: CreatePromotionDto) {
    if (uniquePromotionTypes.includes(promotionData.type)) {
      const existingPromotion = await this.promotionRepo.findOne({
        where: {
          type: promotionData.type,
          isActive: true,
          startDate: LessThanOrEqual(promotionData.endDate),
          endDate: MoreThanOrEqual(promotionData.startDate),
        },
      });

      if (existingPromotion) {
        throw new AppError(AppErrorCode.PromotionExists);
      }
    }

    return await this.promotionRepo.save(promotionData);
  }

  async getPromotions(filters: GetPromotionsDto) {
    const { promotionId, isActive, startDate, endDate, type, limit = 10, page = 1 } = filters;

    const offset = (page - 1) * limit;

    const queryBuilder = this.promotionRepo.createQueryBuilder("promotions");

    queryBuilder
      .leftJoinAndSelect("promotions.playerPromotions", "playerPromotion")
      .addSelect(["playerPromotion.claimed", "playerPromotion.playerId"]);

    if (promotionId) {
      queryBuilder.andWhere("promotions.id = :promotionId", { promotionId });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere("promotions.is_active = :isActive", { isActive });
    }

    if (startDate) {
      queryBuilder.andWhere("promotions.start_date >= :startDate", { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere("promotions.end_date <= :endDate", { endDate });
    }

    if (type) {
      queryBuilder.andWhere("promotions.promotion_type = :type", { type });
    }

    const total = await queryBuilder.getCount();

    const promotions = await queryBuilder.skip(offset).take(limit).getMany();

    return { promotions, total };
  }

  async getPlayerPromotions(playerId: string, filters: GetPromotionsDto) {
    const { promotionId, isActive, startDate, endDate, type, limit = 10, page = 1 } = filters;

    const offset = (page - 1) * limit;

    const queryBuilder = this.promotionRepo
      .createQueryBuilder("promotions")
      .innerJoin("promotions.playerPromotions", "playerPromotion")
      .addSelect("playerPromotion.claimed")
      .andWhere("playerPromotion.player_id = :playerId", { playerId });

    if (promotionId) {
      queryBuilder.andWhere("promotions.id = :promotionId", { promotionId });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere("promotions.is_active = :isActive", { isActive });
    }

    if (startDate) {
      queryBuilder.andWhere("promotions.start_date >= :startDate", { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere("promotions.end_date <= :endDate", { endDate });
    }

    if (type) {
      queryBuilder.andWhere("promotions.promotion_type = :type", { type });
    }

    const total = await queryBuilder.getCount();

    const promotions = (await queryBuilder.skip(offset).take(limit).getMany()).map((promotion) => ({
      ...promotion,
      claimed: promotion.playerPromotions?.[0]?.claimed,
      playerPromotions: undefined,
    }));

    return { promotions, total };
  }

  async claimPromotion(userId: string, promotionId: string, accessToken: string) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const promotion = await this.promotionRepo.findOne({
        where: { id: promotionId },
      });

      if (!promotion) {
        throw new AppError(AppErrorCode.NotFound);
      }

      if (!promotion.isActive) {
        throw new AppError(AppErrorCode.PromotionNotActive);
      }

      const now = new Date();
      if (promotion.endDate && new Date(promotion.endDate) < now) {
        throw new AppError(AppErrorCode.PromotionExpired);
      }

      const playerPromotion = await this.playerPromotionRepo.findOne({
        where: { playerId: userId, promotionId: promotionId },
      });

      if (!playerPromotion) {
        throw new AppError(AppErrorCode.NotFound, "Promotion not found for this user");
      }

      playerPromotion.claimed = true;
      await queryRunner.manager.save(playerPromotion);

      const transactionData: TransactionRequest = {
        userId,
        amount: promotion.amount,
        transactionType: "CREDIT",
        description: `Claimed '${promotion.title}' promotion of type '${promotion.type}'`,
        additionalData: JSON.stringify({ promotion }),
      };

      const metadata = new grpc.Metadata();
      metadata.add("authorization", accessToken);

      await new Promise((resolve, reject) => {
        grpcClient.addTransaction(transactionData, metadata, (error, response) => {
          if (error) {
            logger.error(error);
            reject(new AppError(AppErrorCode.GrpcRequestFailed, error.message));
          } else {
            resolve(response);
          }
        });
      });

      await queryRunner.commitTransaction();

      return { message: "Promotion successfully claimed" };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async assignPromotion(promotionId: string, playerIds: string[]) {
    const promotion = await this.promotionRepo.findOne({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new AppError(AppErrorCode.NotFound);
    }

    if (!promotion.isActive) {
      throw new AppError(AppErrorCode.PromotionNotActive);
    }

    const now = new Date();

    if (new Date(promotion.endDate) < now) {
      throw new AppError(AppErrorCode.PromotionExpired);
    }

    const existingPlayerIds: string[] = await this.playerPromotionRepo
      .find({
        where: {
          promotionId,
          playerId: In(playerIds),
        },
        select: ["playerId"],
      })
      .then((results) => results.map((p) => p.playerId));

    const newPlayerIds = playerIds.filter((id) => !existingPlayerIds.includes(id));

    if (newPlayerIds.length === 0) {
      throw new AppError(AppErrorCode.PromotionClaimed, "All players already have claimed this promotion");
    }
    const newAssignments = newPlayerIds.map((playerId) => ({ playerId, promotionId }));

    await this.playerPromotionRepo.insert(newAssignments);

    await Promise.allSettled(newPlayerIds.map((userId) => sendNotificationProducer(userId, promotion)));
  }

  async assignRegisteredPromotion(playerId: string) {
    const now = new Date();
    const promotion = await this.promotionRepo.findOne({
      where: {
        isActive: true,
        type: PromotionType.WELCOME_BONUS,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
    });
    if (!promotion) {
      return;
    }
    await this.playerPromotionRepo.insert({ playerId, promotionId: promotion.id });
    await sendNotificationProducer(playerId, promotion);
  }
}
