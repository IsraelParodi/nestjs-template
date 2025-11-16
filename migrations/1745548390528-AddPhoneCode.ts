import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneCode1745548390528 implements MigrationInterface {
  name = 'AddPhoneCode1745548390528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "phone_code" character varying`);
    await queryRunner.query(`ALTER TABLE "quotations" ADD "phone_code" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quotations" DROP COLUMN "phone_code"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_code"`);
  }
}
