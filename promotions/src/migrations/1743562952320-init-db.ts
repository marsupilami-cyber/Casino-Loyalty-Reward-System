import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1743562952320 implements MigrationInterface {
    name = 'InitDb1743562952320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "promotion_type" "public"."type" NOT NULL DEFAULT 'BONUS', "amount" numeric(10,2) NOT NULL, "start_date" date NOT NULL DEFAULT ('now'::text)::date, "end_date" date NOT NULL, CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_promotions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "player_id" uuid NOT NULL, "promotion_id" uuid NOT NULL, "claimed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c311d919c4e90b28ecd846b8cd1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "player_promotions" ADD CONSTRAINT "FK_f9947461024d20925b7d4bf839c" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_promotions" DROP CONSTRAINT "FK_f9947461024d20925b7d4bf839c"`);
        await queryRunner.query(`DROP TABLE "player_promotions"`);
        await queryRunner.query(`DROP TABLE "promotions"`);
    }

}
