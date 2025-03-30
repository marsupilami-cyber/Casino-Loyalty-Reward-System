import PlayerPromotion from "./playerPromotions.model";

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { PromotionType } from "../../../../utility/types";

@Entity({ name: "promotions" })
class Promotion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @Column({
    type: "enum",
    enum: PromotionType,
    enumName: "type",
    default: PromotionType.BONUS,
    name: "promotion_type",
  })
  type!: PromotionType;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: string;

  @OneToMany(() => PlayerPromotion, (playerPromotion) => playerPromotion.promotion)
  playerPromotions!: PlayerPromotion[];

  @Column({ name: "start_date", type: "date", default: () => "CURRENT_DATE" })
  startDate!: Date;

  @Column({ name: "end_date", type: "date" })
  endDate!: Date;
}

export default Promotion;
