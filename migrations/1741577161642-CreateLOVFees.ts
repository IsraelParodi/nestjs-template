import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLOVFees1741577161642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO LOV (key, description) VALUES ('containers_size', 'Medida del container');

       INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'containers_size'), '20'' ST', '20'' Standard');
       INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'containers_size'), '40'' ST', '40'' Standard');
       INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'containers_size'), '40'' HC', '40'' High Cube');
       INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'containers_size'), '40'' NOR', '40'' Non Operating Reefer');
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM LOV_DETAIL WHERE key_id IN (SELECT id FROM LOV WHERE key IN ('containers_size'));
  
          DELETE FROM LOV WHERE key IN ('containers_size');
          `,
    );
  }
}
