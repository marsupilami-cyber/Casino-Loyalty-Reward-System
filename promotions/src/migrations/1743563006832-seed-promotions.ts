import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedPromotions1743522072107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "promotions" (id, title, description, is_active, promotion_type, amount, start_date, end_date)
            VALUES (
                uuid_generate_v4(),
                'Welcome Bonus',
                'Get a 20€ welcome bonus on register!',
                true,
                'BONUS',
                20.00,
                NOW(),
                NOW() + INTERVAL '30 days'
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "promotions" WHERE title = 'Welcome Bonus';
        `);
  }
}
