import { AuthService } from "./auth.service";
import { LoginInputDto, LoginOutputDto } from "./dto/login.dto";
import { RefreshOutputDto } from "./dto/refresh.dto";
import { RegisterInputDto, UserOutputDto } from "./dto/user.dto";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import express from "express";
import { StatusCodes } from "http-status-codes";

import accessTokenMiddleware from "../../../middlewares/accessToken";
import authorizeAdmin from "../../../middlewares/authorizeAdmin";
import isActive from "../../../middlewares/isActive";
import refreshTokenMiddleware from "../../../middlewares/refreshToken";
import { AppValidationError } from "../../../utility/appError";
import { ApiResponse, ExtendedRequest, RolesEnum } from "../../../utility/types";

const authService = new AuthService();

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterInputDto"
 *     responses:
 *      '201':
 *        description: User registered successfully.
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: "#/components/schemas/ApiResponse"
 *                - type: object
 *                  properties:
 *                    data:
 *                      $ref: "#/components/schemas/UserOutputDto"
 *      '400':
 *        description: Validation error.
 */
router.post("/register", async (req, res, next) => {
  const userDto = plainToInstance(RegisterInputDto, req.body);
  const errors = await validate(userDto);
  if (errors.length > 0) {
    throw new AppValidationError(errors.map(({ constraints }) => constraints!));
  }

  try {
    const user = await authService.register(userDto, RolesEnum.PLAYER);

    const data = plainToInstance(UserOutputDto, user, { excludeExtraneousValues: true });

    const response: ApiResponse<UserOutputDto> = {
      message: "User registered",
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
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginInputDto"
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly refresh token cookie
 *             schema:
 *               type: string
 *               example: refreshToken=abc123; HttpOnly; Path=/; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: "#/components/schemas/LoginOutputDto"
 *       '400':
 *         description: Validation error.
 *       '401':
 *         description: Unauthorized.
 */
router.post("/login", async (req, res, next) => {
  const loginDto = plainToInstance(LoginInputDto, req.body);

  const errors = await validate(loginDto);
  if (errors.length > 0) {
    throw new AppValidationError(errors.map(({ constraints }) => constraints!));
  }
  try {
    const user = await authService.login(loginDto);

    const data = new LoginOutputDto();
    data.accessToken = user.accessToken;

    const response: ApiResponse<LoginOutputDto> = {
      message: "User logged in",
      success: true,
      data,
    };

    res
      .status(StatusCodes.OK)
      .cookie("refreshToken", user.refreshToken, { httpOnly: true, sameSite: "strict" })
      .json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/register-staff:
 *   post:
 *     summary: Register a staff
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterInputDto"
 *     responses:
 *       '201':
 *         description: Staff registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: "#/components/schemas/UserOutputDto"
 *       '400':
 *         description: Validation error.
 */
router.post("/register-staff", accessTokenMiddleware, isActive, authorizeAdmin, async (req, res, next) => {
  const userDto = plainToInstance(RegisterInputDto, req.body);
  const errors = await validate(userDto);
  if (errors.length > 0) {
    throw new AppValidationError(errors.map(({ constraints }) => constraints!));
  }

  try {
    const user = await authService.register(userDto, RolesEnum.STAFF);

    const data = plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const response: ApiResponse<UserOutputDto> = {
      message: "Staff registered",
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
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *       '401':
 *         description: Unauthorized.
 */
router.post("/logout", refreshTokenMiddleware, isActive, async (req: ExtendedRequest, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    await authService.logout(req.userId!, refreshToken);

    const response: ApiResponse = {
      message: "User logged out",
      success: true,
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: User refresh token
 *     tags: [Auth]
 *     responses:
 *       '201':
 *         description: User refresh token regenerated.
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly refresh token cookie
 *             schema:
 *               type: string
 *               example: refreshToken=abc123; HttpOnly; Path=/; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: "#/components/schemas/RefreshOutputDto"
 *       '401':
 *         description: Unauthorized.
 */
router.post("/refresh", refreshTokenMiddleware, isActive, async (req: ExtendedRequest, res, next) => {
  try {
    const token = req.cookies["refreshToken"];

    const { accessToken, refreshToken } = await authService.refreshToken(req.userId!, token);

    const data = new RefreshOutputDto();
    data.accessToken = accessToken;

    const response: ApiResponse<RefreshOutputDto> = {
      message: "User refresh token regenerated",
      success: true,
    };

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" })
      .status(StatusCodes.CREATED)
      .json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
