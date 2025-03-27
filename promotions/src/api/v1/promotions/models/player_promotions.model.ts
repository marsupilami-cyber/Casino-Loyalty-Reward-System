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

  @Column({ type: "uuid" })
  player_id!: string;

  @Column({ type: "uuid" })
  promotion_id!: string;

  @ManyToOne(() => Promotion, (promotion) => promotion.id, { eager: true })
  @JoinColumn({ name: "promotion_id" })
  promotion!: Promotion;

  @Column({ type: "boolean", default: false })
  claimed!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default PlayerPromotion;
