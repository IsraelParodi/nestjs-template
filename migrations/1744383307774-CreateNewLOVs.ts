import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewLOVs1744383307774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO LOV (key, description) VALUES ('bl_authorization', 'Autorización BL');
    
           INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'bl_authorization'), 'Autorizado', 'Autorizado');
           INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'bl_authorization'), 'Denegado', 'Denegado');
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM LOV_DETAIL WHERE key_id IN (SELECT id FROM LOV WHERE key IN ('bl_authorization'));
  
          DELETE FROM LOV WHERE key IN ('bl_authorization');
          `,
    );
  }
}
