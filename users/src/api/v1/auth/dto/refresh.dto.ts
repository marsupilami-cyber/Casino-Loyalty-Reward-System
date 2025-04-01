import { Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshOutputDto:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *           example: "eyJhbGciOiJIUzI1NiIsInR..."
 */
export class RefreshOutputDto {
  @Expose()
  accessToken!: string;
}
