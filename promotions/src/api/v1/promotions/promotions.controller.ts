import { AssignPromotionDto } from "./dto/assignPromotion.dto";
import { ClaimPromotionDto } from "./dto/claimedPromotion.dto";
import { CreatePromotionDto } from "./dto/createPromotions.dto";
import { GetPromotionsDto } from "./dto/getPromotions.dto";
import { PromotionService } from "./promotions.service";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import express from "express";

const router = express.Router();

const promotionService = new PromotionService();

/**
 * @swagger
 * /api/v1/promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the promotion
 *               description:
 *                 type: string
 *                 description: The description of the promotion
 *               amount:
 *                 type: string
 *                 format: float
 *                 description: Must be a decimal number (e.g., 10.50)
 *                 example: 100.50
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date of the promotion
 *               type:
 *                 type: string
 *                 enum: [PLAYER_REGISTERED, VIP_PROMOTION, BONUS]
 *                 description: The type of promotion
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date of the promotion
 *     responses:
 *       '201':
 *         description: Promotion created successfully.
 *       '400':
 *         description: Validation error.
 */
router.post("/", async (req, res, next) => {
  const createPromotionDto = plainToInstance(CreatePromotionDto, req.body);

  const errors = await validate(createPromotionDto);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: errors.map(({ constraints }) => constraints!),
    });
    return;
  }

  try {
    const promotion = await promotionService.createPromotion(createPromotionDto);
    res.status(201).json({
      success: true,
      data: promotion,
      message: "Promotion created successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/promotions:
 *   get:
 *     summary: Get promotions with filtering
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: promotion_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: is_active
 *         required: false
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: start_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-04-27
 *       - in: query
 *         name: end_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-10-27
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       '200':
 *         description: List of promotions
 */
router.get("/", async (req, res, next) => {
  const getPromotionsDto = plainToInstance(GetPromotionsDto, req.query);

  const errors = await validate(getPromotionsDto);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: errors.map(({ constraints }) => constraints!),
    });
    return;
  }

  try {
    const promotions = await promotionService.getPromotions(getPromotionsDto);
    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/promotions/claim:
 *   post:
 *     summary: Claim a promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the user
 *               promotion_id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the promotion
 *     responses:
 *       '200':
 *         description: Promotion claimed successfully.
 *       '400':
 *         description: Promotion already claimed or validation error.
 *       '404':
 *         description: Promotion not found or user not eligible.
 */
router.post("/claim", async (req, res, next) => {
  const claimPromotionDto = plainToInstance(ClaimPromotionDto, req.body);

  const errors = await validate(claimPromotionDto);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: errors.map(({ constraints }) => constraints!),
    });
    return;
  }

  try {
    const result = await promotionService.claimPromotion(claimPromotionDto);
    res.status(200).json({
      success: true,
      data: result,
      message: "Promotion claimed successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignPromotionDto:
 *       type: object
 *       properties:
 *         user_ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: The list of user IDs to assign to the promotion.
 *           example: ["user_id_1", "user_id_2"]
 *       required:
 *         - user_ids
 *
 * /api/v1/promotions/{promotion_id}/assign:
 *   post:
 *     summary: Assign users to a promotion
 *     tags: [Promotions]
 *     description: Assigns multiple users to a promotion, ensuring the promotion is active and valid.
 *     parameters:
 *       - in: path
 *         name: promotion_id
 *         required: true
 *         description: The ID of the promotion to assign
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignPromotionDto'
 *     responses:
 *       '201':
 *         description: Promotion successfully assigned to users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Promotion assigned successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       playerId:
 *                         type: string
 *                         format: uuid
 *                         description: The ID of the player who was assigned the promotion
 *                       promotionId:
 *                         type: string
 *                         format: uuid
 *                         description: The ID of the promotion assigned to the player
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         description: The unique ID of the promotion assignment
 *                       claimed:
 *                         type: boolean
 *                         description: Whether the promotion has been claimed or not
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the promotion was assigned
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the promotion assignment was last updated
 *                   example:
 *                     - playerId: "53b2b0f3-a250-45b3-8282-6ba12e934af0"
 *                       promotionId: "edb7bb89-0689-4464-962a-7366512c1b16"
 *                       id: "25f44bd7-7307-43e7-89ed-269570052a2c"
 *                       claimed: false
 *                       createdAt: "2025-03-27T21:50:24.472Z"
 *                       updatedAt: "2025-03-27T21:50:24.472Z"
 *       '400':
 *         description: Validation error or user IDs are invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["user_ids must be an array", "user_ids should not be empty"]
 *       '404':
 *         description: Promotion not found or user(s) not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Promotion not found"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/:promotion_id/assign", async (req, res, next) => {
  const promotionId = req.params.promotion_id;

  const assignPromotionDto = plainToInstance(AssignPromotionDto, req.body);

  const errors = await validate(assignPromotionDto);
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: errors.map(({ constraints }) => constraints!),
    });
    return;
  }

  try {
    const assignedPromotions = await promotionService.assignPromotion(promotionId, assignPromotionDto.user_ids);
    res.status(201).json({
      success: true,
      data: assignedPromotions,
      message: "Promotion assigned successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
