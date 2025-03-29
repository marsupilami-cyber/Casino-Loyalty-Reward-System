import { ClaimPromotionDto } from "./dto/claimedPromotion.dto";
import { CreatePromotionDto } from "./dto/createPromotions.dto";
import { GetPromotionsDto } from "./dto/getPromotions.dto";
import PlayerPromotion from "./models/player_promotions.model";
import Promotion from "./models/promotions.model";

import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";

import { AppDataSource } from "../../../config/db";
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
    try {
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
          throw new Error("Promotion already exists in selected range.");
        }
      }

      return await this.promotionRepo.save(promotionData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getPromotions(filters: GetPromotionsDto) {
    const { userId, promotionId, isActive, startDate, endDate, type, limit = 10, offset = 0 } = filters;

    const paginationLimit = limit || 10;
    const page = offset ? offset - 1 : 0;
    try {
      const queryBuilder = this.promotionRepo.createQueryBuilder("promotions");

      if (userId) {
        queryBuilder
          .innerJoin("promotions.playerPromotions", "playerPromotion")
          .andWhere("playerPromotion.player_id = :userId", { userId });
      }

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

      const promotions = await queryBuilder
        .skip(page * paginationLimit)
        .take(paginationLimit)
        .getMany();

      return promotions;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  claimPromotion = async (claimDto: ClaimPromotionDto) => {
    try {
      const { userId, promotionId } = claimDto;

      const promotion = await this.promotionRepo.findOne({
        where: { id: promotionId },
      });

      if (!promotion) {
        throw new Error("Promotion not found");
      }

      if (!promotion.isActive) {
        throw new Error("Promotion is not active");
      }

      const now = new Date();
      if (promotion.endDate && new Date(promotion.endDate) < now) {
        throw new Error("Promotion has expired");
      }

      const playerPromotion = await this.playerPromotionRepo.findOne({
        where: { playerId: userId, promotionId: promotionId },
      });

      if (!playerPromotion) {
        throw new Error("User does not have this promotion");
      }

      playerPromotion.claimed = true;
      await this.playerPromotionRepo.save(playerPromotion);

      return { message: "Promotion successfully claimed" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  async assignPromotion(promotionId: string, playerIds: string[]) {
    try {
      const promotion = await this.promotionRepo.findOne({
        where: { id: promotionId },
      });

      if (!promotion) {
        throw new Error("Promotion not found");
      }

      if (!promotion.isActive) {
        throw new Error("Promotion is not active");
      }

      const now = new Date();

      if (new Date(promotion.endDate) < now) {
        throw new Error("Promotion has expired");
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
        throw new Error("All players already have this promotion");
      }
      const newAssignments = newPlayerIds.map((playerId) => ({ playerId, promotionId }));

      await this.playerPromotionRepo.insert(newAssignments);

      await Promise.allSettled(newPlayerIds.map((userId) => sendNotificationProducer(userId, promotion)));

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async assignRegisteredPromotion(playerId: string) {
    try {
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
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
