import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToRoles1745896338084 implements MigrationInterface {
  name = 'AddDescriptionToRoles1745896338084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" ADD "description" character varying`);
    await queryRunner.query(`
            UPDATE roles
            SET description = 'Administrador'
            WHERE name = 'admin';

            UPDATE roles
            SET description = 'Cliente'
            WHERE name = 'customer'
            `);
    await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "description" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "description"`);
  }
}
