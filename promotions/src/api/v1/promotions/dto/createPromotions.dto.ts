import { Expose } from "class-transformer";
import { IsString, IsOptional, IsDateString, IsNotEmpty, IsEnum, IsDecimal } from "class-validator";

import { PromotionType } from "../../../../utility/types";

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: "1,2" })
  amount!: string;

  @Expose({ name: "start_date" })
  @IsDateString()
  @IsNotEmpty()
  startDate!: Date;

  @IsOptional()
  @IsEnum(PromotionType)
  type!: PromotionType;

  @Expose({ name: "end_date" })
  @IsDateString()
  @IsNotEmpty()
  endDate!: Date;
}
