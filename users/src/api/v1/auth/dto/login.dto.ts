import { Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInputDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: password
 */
export class LoginInputDto {
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsString()
  password!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginOutputDto:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *           example: "eyJhbGciOiJIUzI1NiIsInR..."
 */
export class LoginOutputDto {
  @Expose()
  accessToken!: string;
}
