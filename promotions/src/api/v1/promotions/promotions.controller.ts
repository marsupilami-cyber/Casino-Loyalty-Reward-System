import { AssignPromotionDto } from "./dto/assignPromotion.dto";
import { ClaimPromotionDto } from "./dto/claimPromotion.dto";
import { CreatePromotionDto } from "./dto/createPromotions.dto";
import { GetPromotionsDto, PlayerPromotionOutput, PromotionOutputDto } from "./dto/getPromotions.dto";
import { PromotionService } from "./promotions.service";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import express from "express";
import { StatusCodes } from "http-status-codes";

import authorizeStaff from "../../../middlewares/authorizeStaff";
import { AppValidationError } from "../../../utility/appError";
import { ApiResponse, ExtendedRequest, RolesEnum } from "../../../utility/types";

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
 *         description: Promotion created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: "#/components/schemas/BasePromotionDto"
 *       '400':
 *         description: Validation error.
 */
router.post("/", authorizeStaff, async (req, res, next) => {
  const createPromotionDto = plainToInstance(CreatePromotionDto, req.body);

  const errors = await validate(createPromotionDto);
  if (errors.length > 0) {
    throw new AppValidationError(errors.map(({ constraints }) => constraints!));
  }

  try {
    const promotion = await promotionService.createPromotion(createPromotionDto);

    const data = plainToInstance(PromotionOutputDto, promotion, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const response: ApiResponse<PromotionOutputDto> = {
      message: "Promotion created successfully",
      success: true,
      data,
    };
    res.status(StatusCodes.CREATED).json(response);
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
 *       - $ref: '#/components/parameters/PromotionIdParam'
 *       - $ref: '#/components/parameters/IsActiveParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *       - $ref: '#/components/parameters/TypeParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       '200':
 *         description: List of promotions
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponseWithMeta"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/PromotionOutputDto"
 */
router.get("/", authorizeStaff, async (req: ExtendedRequest, res, next) => {
  const getPromotionsDto = plainToInstance(GetPromotionsDto, req.query);

  const errors = await validate(getPromotionsDto);
  if (errors.length > 0) {
    throw new AppValidationError(errors.map(({ constraints }) => constraints!));
  }

  try {
    const data = await promotionService.getPromotions(getPromotionsDto);

    const promotionsDto = plainToInstance(PromotionOutputDto, data.promotions, { excludeExtraneousValues: true });

    const response: ApiResponse<PromotionOutputDto[]> = {
      message: "Get all promotions",
      success: true,
      data: promotionsDto,
      meta: {
        limit: getPromotionsDto.limit,
        page: getPromotionsDto.page,
        total: data.total,
      },
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/promotions/players/{player_id}:
 *   get:
 *     summary: Get player promotions with filtering
 *     tags: [Promotions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: player_id
 *         required: true
 *         description: The ID of the player
 *         schema:
 *          type: string
 *          format: uuid
 *       - $ref: '#/components/parameters/PromotionIdParam'
 *       - $ref: '#/components/parameters/IsActiveParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *       - $ref: '#/components/parameters/TypeParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       '200':
 *         description: List of player promotions
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponseWithMeta"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/PlayerPromotionOutputDto"
 */
router.get("/players/:player_id", async (req: ExtendedRequest, res, next) => {
  const playerId = req.role === RolesEnum.PLAYER ? req.userId! : req.params.player_id;

  const getPromotionsDto = plainToInstance(GetPromotionsDto, req.query);

  try {
    const data = await promotionService.getPlayerPromotions(playerId, getPromotionsDto);
    const promotionsDto = plainToInstance(PlayerPromotionOutput, data.promotions, {
      excludeExtraneousValues: true,
    });

    const response: ApiResponse<PlayerPromotionOutput[]> = {
      message: "Get all promotions of player",
      success: true,
      data: promotionsDto,
      meta: {
        limit: getPromotionsDto.limit,
        page: getPromotionsDto.page,
        total: data.total,
      },
    };

    res.status(StatusCodes.OK).json(response);
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
 *       '201':
 *         description: Promotion claimed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *       '400':
 *         description: Promotion already claimed or validation error.
 */
router.post("/claim", async (req: ExtendedRequest, res, next) => {
  const claimPromotionDto = plainToInstance(ClaimPromotionDto, req.body);

  const errors = await validate(claimPromotionDto);
  if (errors.length > 0) {
    throw new AppValidationError(errors.map(({ constraints }) => constraints!));
  }
  const accessToken = req.get("authorization");

  try {
    await promotionService.claimPromotion(req.userId!, claimPromotionDto.promotionId, accessToken!);

    const response: ApiResponse = {
      message: "Promotion claimed successfully",
      success: true,
    };

    res.status(StatusCodes.CREATED).json(response);
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 */
router.post("/:promotion_id/assign", authorizeStaff, async (req, res, next) => {
  const promotionId = req.params.promotion_id;

  const assignPromotionDto = plainToInstance(AssignPromotionDto, req.body);

  const errors = await validate(assignPromotionDto);
  if (errors.length > 0) {
    throw new AppValidationError(errors.map(({ constraints }) => constraints!));
  }

  try {
    await promotionService.assignPromotion(promotionId, assignPromotionDto.userIds);

    const response: ApiResponse = {
      message: "Promotion assigned successfully",
      success: true,
    };

    res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
