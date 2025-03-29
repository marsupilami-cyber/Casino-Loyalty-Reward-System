import { Expose, Transform } from "class-transformer";
import { IsString, IsOptional, IsBoolean, IsDateString, IsUUID, IsInt, Min, Max } from "class-validator";

export class GetPromotionsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  promotionId?: string;

  @IsOptional()
  @Transform(({ obj, key }) => {
    return obj[key] === "true" ? true : obj[key] === "false" ? false : obj[key];
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return isNaN(Number(value)) ? 0 : Number(value);
  })
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return isNaN(Number(value)) ? 0 : Number(value);
  })
  @IsInt()
  @Min(0)
  offset?: number;
}
