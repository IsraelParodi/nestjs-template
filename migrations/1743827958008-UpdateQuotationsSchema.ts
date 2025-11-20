import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuotationsSchema1743827958008 implements MigrationInterface {
  name = 'UpdateQuotationsSchema1743827958008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "quotations"
        ADD "document_type" character varying NOT NULL,
        ADD "document_number" character varying NOT NULL,
        ADD "shipping_type" character varying,
        ADD "cargo_volume" integer NOT NULL,
        ADD "origin" character varying NOT NULL,
        ADD "destination" character varying NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "quotations"
        DROP COLUMN "destination",
        DROP COLUMN "origin",
        DROP COLUMN "cargo_volume",
        DROP COLUMN "shipping_type",
        DROP COLUMN "document_number",
        DROP COLUMN "document_type"
    `);
  }
}
