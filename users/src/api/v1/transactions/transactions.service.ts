import User from "../users/users.model";
import { AddTransactionDto } from "./dto/addTransaction.dto";
import Transaction from "./transactions.model";

import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../config/db";
import { AppError, AppErrorCode } from "../../../utility/appError";
import { TransactionTypesEnum } from "../../../utility/types";

export class TransactionService {
  private userRepo: Repository<User>;
  private transactionRepo: Repository<Transaction>;

  constructor() {
    this.transactionRepo = AppDataSource.getRepository(Transaction);
    this.userRepo = AppDataSource.getRepository(User);
  }

  addTransaction = async (transactionDto: AddTransactionDto) => {
    try {
      const user = await this.userRepo.findOneBy({ id: transactionDto.userId });
      if (!user) {
        throw new AppError(AppErrorCode.NotFound, "User is not found");
      }

      const transaction = plainToInstance(Transaction, transactionDto);
      transaction.user = user;

      await this.transactionRepo.save(transaction);
      if (transaction.transactionType === TransactionTypesEnum.CREDIT) {
        user.balance += transaction.amount;
      } else {
        user.balance -= transaction.amount;
      }

      await this.userRepo.save(user);

      return { userId: user.id, balance: user.balance };
    } catch (error) {
      throw error;
    }
  };
}
