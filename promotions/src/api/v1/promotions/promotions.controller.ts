import { AssignPromotionDto } from "./dto/assignPromotion.dto";
import { ClaimPromotionDto } from "./dto/claimedPromotion.dto";
import { CreatePromotionDto } from "./dto/createPromotions.dto";
import { GetPromotionsDto } from "./dto/getPromotions.dto";
import { PromotionOutputDto } from "./dto/promotions.dto";
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
 *             $ref: "#/components/schemas/CreatePromotionDto"
 *     responses:
 *       '201':
 *         description: Promotion created successfuly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromotionOutputDto'
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

    const data = plainToInstance(PromotionOutputDto, promotion, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    res.status(201).json({
      success: true,
      data,
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
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: promotionId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-04-27
 *       - in: query
 *         name: endDate
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PromotionOutputDto'
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
 *             $ref: '#/components/schemas/ClaimPromotionDto'
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
    await promotionService.claimPromotion(claimPromotionDto);
    res.status(200).json({
      success: true,
      message: "Promotion claimed successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
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
    await promotionService.assignPromotion(promotionId, assignPromotionDto.userIds);

    res.status(201).json({
      success: true,
      message: "Promotion assigned successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
