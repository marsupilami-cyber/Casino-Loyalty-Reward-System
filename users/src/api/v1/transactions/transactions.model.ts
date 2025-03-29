import User from "../users/users.model";

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";

import { TransactionTypesEnum } from "../../../utility/types";

@Entity({ name: "transactions" })
class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  amount!: number;

  @Column({
    type: "enum",
    enum: TransactionTypesEnum,
    name: "transaction_type",
  })
  transactionType!: TransactionTypesEnum;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ type: "json", nullable: true, name: "additional_data" })
  additionalData?: Record<string, any>;
}

export default Transaction;
