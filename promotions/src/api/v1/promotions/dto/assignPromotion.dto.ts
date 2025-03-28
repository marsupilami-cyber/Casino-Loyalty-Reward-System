import { Transform } from "class-transformer";
import { IsArray, IsString, ArrayNotEmpty } from "class-validator";

export class AssignPromotionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  user_ids!: string[];
}
