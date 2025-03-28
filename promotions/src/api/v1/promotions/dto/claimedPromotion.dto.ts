import { Expose } from "class-transformer";
import { IsUUID, IsNotEmpty } from "class-validator";

export class ClaimPromotionDto {
  @Expose({ name: "user_id" })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @Expose({ name: "promotion_id" })
  @IsUUID()
  @IsNotEmpty()
  promotionId!: string;
}
