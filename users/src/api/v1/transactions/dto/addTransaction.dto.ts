import { UserOutputDto } from "../../auth/dto/user.dto";

import { Expose, Transform } from "class-transformer";
import { IsEnum, IsJSON, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min } from "class-validator";

import { TransactionTypesEnum } from "../../../../utility/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     AddTransactionDto:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user making the transaction
 *         amount:
 *           type: number
 *           format: float
 *           description: The transaction amount
 *         transactionType:
 *           type: number
 *           enum:
 *             - 0
 *             - 1
 *           description: The type of the transaction (0 - CREDIT, 1 - DEBIT)
 *           example: 0
 *         description:
 *           type: string
 *           description: A brief description of the transaction
 *         additionalData:
 *           type: object
 *           additionalProperties: true
 *           description: Any additional metadata related to the transaction
 *       required:
 *         - userId
 *         - amount
 *         - transactionType
 */
export class AddTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: "amount must be a positive number" })
  amount!: number;

  @IsEnum(TransactionTypesEnum)
  @IsNotEmpty()
  transactionType!: TransactionTypesEnum;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
  })
  @IsObject()
  additionalData?: Record<string, any>;
}
