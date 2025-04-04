import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

import { RolesEnum } from "../../../../utility/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInputDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: User's password
 *           minLength: 6
 *           maxLength: 20
 *           example: "password"
 */
export class RegisterInputDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserOutputDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         active:
 *           type: boolean
 *           description: Indicates whether the user is active
 *         balance:
 *           type: number
 *           format: float
 *           description: The balance of the user
 *         role:
 *           type: string
 *           enum:
 *             - PLAYER
 *             - ADMIN
 *           description: The role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *       required:
 *         - id
 *         - email
 *         - active
 *         - balance
 *         - role
 *         - createdAt
 *         - updatedAt
 */
export class UserOutputDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  active!: boolean;

  @Expose()
  balance!: number;

  @Expose()
  role!: RolesEnum;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
