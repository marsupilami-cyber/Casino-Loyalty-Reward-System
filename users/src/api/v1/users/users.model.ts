import Transaction from "../transactions/transactions.model";

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { RolesEnum } from "../../../utility/types";

@Entity({ name: "users" })
class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  balance!: number;

  @Column({
    type: "enum",
    enum: RolesEnum,
    default: "PLAYER",
  })
  role!: RolesEnum;

  @OneToMany(() => Transaction, (transactions) => transactions.user)
  transactions!: Transaction[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default User;
