import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShipperLov1745551875456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        INSERT INTO LOV (key, description) VALUES ('shippers', 'Navieras');

        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'CMA-CGM', 'CMA-CGM');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Cosco', 'Cosco');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Evergreen', 'Evergreen');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Hapag Lloyd', 'Hapag Lloyd');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Hyundai', 'Hyundai');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Maersk / Sealand', 'Maersk / Sealand');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'MSC', 'MSC');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Ocean Network Express', 'Ocean Network Express');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Orient Overseas Container Line', 'Orient Overseas Container Line');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'PIL', 'PIL');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Seaboard', 'Seaboard');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Wan Hai', 'Wan Hai');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shippers'), 'Yang Ming', 'Yang Ming');

        INSERT INTO LOV (key, description) VALUES ('airlines', 'Aerolineas');

        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'Aerolíneas Argentinas', 'Aerolíneas Argentinas');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'American Airlines', 'American Airlines');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'Avianca', 'Avianca');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'LATAM Cargo', 'LATAM Cargo');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'Aercaribe', 'Aercaribe');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'Sky', 'Sky');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'Airmax Cargo', 'Airmax Cargo');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'airlines'), 'Copa Airlines', 'Copa Airlines');
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DELETE FROM LOV_DETAIL WHERE key_id IN (SELECT id FROM LOV WHERE key IN ('shippers', 'airlines'));
        DELETE FROM LOV WHERE key IN ('shippers', 'airlines');
    `,
    );
  }
}
