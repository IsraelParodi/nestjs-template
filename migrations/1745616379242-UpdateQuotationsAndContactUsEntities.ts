import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuotationsAndContactUsEntities1745616379242 implements MigrationInterface {
  name = 'UpdateQuotationsAndContactUsEntities1745616379242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quotations" ADD "container_code" character varying`);
    await queryRunner.query(`ALTER TABLE "contact-us" ADD "phone_code" character varying`);
    await queryRunner.query(`ALTER TABLE "quotations" ALTER COLUMN "cargo_volume" DROP NOT NULL`);
    await queryRunner.query(`
        UPDATE lov_detail
        SET
            detail = 'Contenedor (FCL)'
        WHERE name = 'FCL';
        
        UPDATE lov_detail
        SET
            detail = 'Carga Suelta (LCL)'
        WHERE name = 'LCL';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quotations" ALTER COLUMN "cargo_volume" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "contact-us" DROP COLUMN "phone_code"`);
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "container_code"`);
    await queryRunner.query(`
        UPDATE lov_detail
        SET
            detail = 'Full Container Load'
        WHERE name = 'FCL';
        
        UPDATE lov_detail
        SET
            detail = 'Less Than Container Load'
        WHERE name = 'LCL';
        `);
  }
}
