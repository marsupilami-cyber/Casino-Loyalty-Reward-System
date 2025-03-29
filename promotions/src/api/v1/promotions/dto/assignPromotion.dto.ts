import { Expose, Transform } from "class-transformer";
import { IsArray, IsString, ArrayNotEmpty } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignPromotionDto:
 *       type: object
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: The list of user IDs to assign to the promotion.
 *           example: ["uuid", "uuid"]
 *       required:
 *         - userIds
 */
export class AssignPromotionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds!: string[];
}
