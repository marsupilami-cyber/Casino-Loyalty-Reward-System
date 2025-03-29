import { Expose } from "class-transformer";
import { IsUUID, IsNotEmpty } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClaimPromotionDto:
 *       type: object
 *       required:
 *         - userId
 *         - promotionId
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user
 *         promotionId:
 *           type: string
 *           format: uuid
 *           description: The ID of the promotion
 */
export class ClaimPromotionDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  promotionId!: string;
}
