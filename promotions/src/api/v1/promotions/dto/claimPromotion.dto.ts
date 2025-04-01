import { IsUUID, IsNotEmpty } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClaimPromotionDto:
 *       type: object
 *       required:
 *         - promotionId
 *       properties:
 *         promotionId:
 *           type: string
 *           format: uuid
 *           description: The ID of the promotion
 */
export class ClaimPromotionDto {
  @IsUUID()
  @IsNotEmpty()
  promotionId!: string;
}
