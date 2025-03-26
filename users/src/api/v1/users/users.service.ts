import User from "./users.model";

import { Repository } from "typeorm";

import { AppDataSource } from "../../../config/db";

export class UserService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  getUserRepo() {
    return this.userRepo;
  }
}
