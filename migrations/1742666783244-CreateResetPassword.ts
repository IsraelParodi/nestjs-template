import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateResetPassword1742666783244 implements MigrationInterface {
    name = 'CreateResetPassword1742666783244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_passwords" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "UQ_a1a10df910ec82a3df327dea0dc" UNIQUE ("email"), CONSTRAINT "PK_9460c1c9b1d85658a023ae8e87f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reset_passwords" ADD CONSTRAINT "FK_21e0100ec67875a9e09f0aa720b" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reset_passwords" ADD CONSTRAINT "FK_4e690653f469fad8a80228ca7d5" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reset_passwords" ADD CONSTRAINT "FK_d90c4089d7338bf3b5dcaa48e82" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_passwords" DROP CONSTRAINT "FK_d90c4089d7338bf3b5dcaa48e82"`);
        await queryRunner.query(`ALTER TABLE "reset_passwords" DROP CONSTRAINT "FK_4e690653f469fad8a80228ca7d5"`);
        await queryRunner.query(`ALTER TABLE "reset_passwords" DROP CONSTRAINT "FK_21e0100ec67875a9e09f0aa720b"`);
        await queryRunner.query(`DROP TABLE "reset_passwords"`);
    }

}
