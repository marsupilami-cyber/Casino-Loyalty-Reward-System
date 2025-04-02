import bcrypt from "bcryptjs";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUser1743592052724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash("password", 10);

    await queryRunner.query(`
            INSERT INTO "users" ("email", "password", "role") 
            VALUES ('admin@example.com', '${hashedPassword}', 'ADMIN')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "users" WHERE "email" = 'admin@example.com'
        `);
  }
}
