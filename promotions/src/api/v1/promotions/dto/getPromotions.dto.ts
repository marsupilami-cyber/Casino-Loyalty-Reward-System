import { Expose, Transform, Type } from "class-transformer";
import { IsOptional, IsBoolean, IsDateString, IsUUID, IsInt, Min, IsEnum } from "class-validator";

import { PromotionType } from "../../../../utility/types";

/**
 * @swagger
 * components:
 *   parameters:
 *     PromotionIdParam:
 *       name: promotionId
 *       in: query
 *       description: Promotion ID for filtering specific promotion
 *       required: false
 *       schema:
 *         type: string
 *         format: uuid
 *     IsActiveParam:
 *       name: isActive
 *       in: query
 *       description: Filter promotions by whether they are active
 *       required: false
 *       schema:
 *         type: boolean
 *     StartDateParam:
 *       name: startDate
 *       in: query
 *       description: Filter promotions starting after the specified date
 *       required: false
 *       schema:
 *         type: string
 *         format: date-time
 *         example: 2020-04-27
 *     EndDateParam:
 *       name: endDate
 *       in: query
 *       description: Filter promotions ending before the specified date
 *       required: false
 *       schema:
 *         type: string
 *         format: date-time
 *     TypeParam:
 *       name: type
 *       in: query
 *       description: Filter promotions by type
 *       required: false
 *       schema:
 *         type: string
 *         enum: ["WELCOME_BONUS", "VIP_PROMOTION", "BONUS"]
 *     PageParam:
 *       name: page
 *       in: query
 *       description: Page of the pagination
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 0
 *     LimitParam:
 *       name: limit
 *       in: query
 *       description: Limit the number of returned promotions
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 */
export class GetPromotionsDto {
  @IsOptional()
  @IsUUID()
  promotionId?: string;

  @IsOptional()
  @Transform(({ obj, key }) => {
    return obj[key] === "true" ? true : obj[key] === "false" ? false : obj[key];
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     BasePromotionDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         title:
 *           type: string
 *           example: "Welcome Bonus"
 *         description:
 *           type: string
 *           example: "Get a welcome bonus on registration"
 *         isActive:
 *           type: boolean
 *           example: true
 *         type:
 *           type: string
 *           enum: [WELCOME_BONUS, VIP_PROMOTION, BONUS]
 *           example: "WELCOME_BONUS"
 *         amount:
 *           type: string
 *           example: "20.00"
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T23:59:59Z"
 */
class BasePromotionDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  type!: PromotionType;

  @Expose()
  amount!: string;

  @Expose()
  startDate!: Date;

  @Expose()
  endDate!: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayerPromotionInfoDto:
 *       type: object
 *       properties:
 *         playerId:
 *           type: string
 *           format: uuid
 *         claimed:
 *           type: boolean
 */
class PlayerPromotionInfoDto {
  @Expose()
  playerId!: string;

  @Expose()
  claimed!: boolean;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PromotionOutputDto:
 *       allOf:
 *         - $ref: '#/components/schemas/BasePromotionDto'
 *         - type: object
 *           properties:
 *             playerPromotions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlayerPromotionInfoDto'
 */
export class PromotionOutputDto extends BasePromotionDto {
  @Expose()
  @Type(() => PlayerPromotionInfoDto)
  playerPromotions!: PlayerPromotionInfoDto[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayerPromotionDto:
 *       allOf:
 *         - $ref: '#/components/schemas/BasePromotionDto'
 *         - type: object
 *           properties:
 *             claimed:
 *               type: boolean
 *               description: Indicates whether the promotion has been claimed by the player
 *               example: true
 *           required:
 *             - claimed
 */
export class PlayerPromotionOutput extends BasePromotionDto {
  @Expose()
  claimed!: boolean;
}
