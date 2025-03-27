import PlayerPromotion from "./player_promotions.model";

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: "promotions" })
class Promotion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @OneToMany(() => PlayerPromotion, (playerPromotion) => playerPromotion.promotion)
  playerPromotions!: PlayerPromotion[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  startDate!: Date;

  @Column({ type: "timestamp", nullable: true })
  endDate?: Date;
}

export default Promotion;
