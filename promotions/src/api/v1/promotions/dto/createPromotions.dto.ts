import { Expose } from "class-transformer";
import { IsString, IsOptional, IsDateString, IsNotEmpty, IsEnum, IsDecimal } from "class-validator";

import { PromotionType } from "../../../../utility/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePromotionDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - amount
 *         - startDate
 *         - endDate
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the promotion
 *           example: "Welcome Bonus"
 *         description:
 *           type: string
 *           description: Description of the promotion
 *           example: "Get a welcome bonus on registration"
 *         amount:
 *           type: string
 *           description: The amount of the promotion
 *           example: "20.00"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date of the promotion
 *           example: "2025-01-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date of the promotion
 *           example: "2025-01-10T23:59:59Z"
 *         type:
 *           type: string
 *           description: The type of the promotion (if applicable)
 *           enum: [WELCOME_BONUS, VIP_PROMOTION, BONUS]
 *           example: "WELCOME_BONUS"
 */
export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: "1,2" })
  amount!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: Date;

  @IsOptional()
  @IsEnum(PromotionType)
  type!: PromotionType;

  @IsDateString()
  @IsNotEmpty()
  endDate!: Date;
}
