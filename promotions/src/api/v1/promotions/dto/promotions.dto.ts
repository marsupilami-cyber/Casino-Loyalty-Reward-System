import { Expose } from "class-transformer";

import { PromotionType } from "../../../../utility/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     PromotionOutputDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the promotion
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         title:
 *           type: string
 *           description: Title of the promotion
 *           example: "Welcome Bonus"
 *         description:
 *           type: string
 *           description: Description of the promotion
 *           example: "Get a welcome bonus on registration"
 *         isActive:
 *           type: boolean
 *           description: Whether the promotion is currently active
 *           example: true
 *         type:
 *           type: string
 *           description: The type of the promotion (if applicable)
 *           enum: [WELCOME_BONUS, VIP_PROMOTION, BONUS]
 *           example: "WELCOME_BONUS"
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
 */
export class PromotionOutputDto {
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
