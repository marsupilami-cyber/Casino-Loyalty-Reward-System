import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1743572663255 implements MigrationInterface {
  name = "InitDatabase1743572663255";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."promotion_type_enum" AS ENUM('WELCOME_BONUS', 'VIP_PROMOTION', 'BONUS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "promotion_type" "public"."promotion_type_enum" NOT NULL DEFAULT 'BONUS', "amount" numeric(10,2) NOT NULL, "start_date" date NOT NULL DEFAULT ('now'::text)::date, "end_date" date NOT NULL, CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_promotions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "player_id" uuid NOT NULL, "promotion_id" uuid NOT NULL, "claimed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c311d919c4e90b28ecd846b8cd1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_promotions" ADD CONSTRAINT "FK_f9947461024d20925b7d4bf839c" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`
            INSERT INTO "promotions" (id, title, description, is_active, promotion_type, amount, start_date, end_date)
            VALUES (
                uuid_generate_v4(),
                'Welcome Bonus',
                'Get a 20€ welcome bonus on register!',
                true,
                'WELCOME_BONUS',
                20.00,
                NOW(),
                NOW() + INTERVAL '30 days'
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "player_promotions" DROP CONSTRAINT "FK_f9947461024d20925b7d4bf839c"`);
    await queryRunner.query(`DROP TABLE "player_promotions"`);
    await queryRunner.query(`DROP TABLE "promotions"`);
    await queryRunner.query(`DROP TYPE "public"."type"`);
  }
}
