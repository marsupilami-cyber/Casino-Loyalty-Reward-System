import { Expose, Transform } from "class-transformer";
import { IsEnum, IsJSON, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min } from "class-validator";

import { TransactionTypesEnum } from "../../../../utility/types";

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
