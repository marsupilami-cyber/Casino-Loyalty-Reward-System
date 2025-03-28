import { Expose, Transform } from "class-transformer";
import { IsString, IsOptional, IsBoolean, IsDateString, IsUUID, IsInt, Min, Max } from "class-validator";

export class GetPromotionsDto {
  @Expose({ name: "user_id" })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @Expose({ name: "promotion_id" })
  @IsOptional()
  @IsUUID()
  promotionId?: string;

  @Expose({ name: "is_active" })
  @IsOptional()
  @Transform(({ obj, key }) => {
    return obj[key] === "true" ? true : obj[key] === "false" ? false : obj[key];
  })
  @IsBoolean()
  isActive?: boolean;

  @Expose({ name: "start_date" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Expose({ name: "end_date" })
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
