import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuotationsSchema1743827958008 implements MigrationInterface {
  name = 'UpdateQuotationsSchema1743827958008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quotations" ADD "document_type" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "quotations" ADD "document_number" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "quotations" ADD "shipping_type" character varying`);
    await queryRunner.query(`ALTER TABLE "quotations" ADD "cargo_volume" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "quotations" ADD "origin" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "quotations" ADD "destination" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "destination"`);
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "origin"`);
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "cargo_volume"`);
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "shipping_type"`);
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "document_number"`);
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "document_type"`);
  }
}
