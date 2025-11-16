import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEntity1742660279787 implements MigrationInterface {
  name = 'UpdateUserEntity1742660279787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastname" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "business_tax_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "legal_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "address" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "country_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_82d2ea5f3f8a99449e541918b55" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER SEQUENCE roles_id_seq RESTART WITH 2;`);
    await queryRunner.query(`INSERT INTO ROLES (name) VALUES ('customer')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_82d2ea5f3f8a99449e541918b55"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "legal_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "business_tax_id"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastname"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER SEQUENCE roles_id_seq RESTART WITH 1;`);
    await queryRunner.query(`DELETE FROM ROLES WHERE name='customer'`);
  }
}
