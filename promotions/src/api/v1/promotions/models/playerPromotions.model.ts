import Promotion from "./promotions.model";

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

@Entity({ name: "player_promotions" })
class PlayerPromotion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "player_id" })
  playerId!: string;

  @Column({ type: "uuid", name: "promotion_id" })
  promotionId!: string;

  @ManyToOne(() => Promotion, (promotion) => promotion.id, { eager: true })
  @JoinColumn({ name: "promotion_id" })
  promotion!: Promotion;

  @Column({ type: "boolean", default: false })
  claimed!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export default PlayerPromotion;
