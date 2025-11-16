import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListOfValues1737952885959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "lov" (
            "id" SERIAL NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, 
            "key" character varying NOT NULL, 
            "description" character varying NOT NULL, 
            "created_by" integer, 
            "updated_by" integer, 
            "deleted_by" integer, 
            CONSTRAINT "UQ_9f8316d695f6c2cbf923bcfc25f" UNIQUE ("key"), 
            CONSTRAINT "PK_ac8566a3a7af55196019ec4523d" PRIMARY KEY ("id")
        );

        CREATE INDEX idx_lov_key ON LOV (key);

        CREATE TABLE "lov_detail" (
            "id" SERIAL NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, 
            "name" character varying NOT NULL, 
            "detail" character varying NOT NULL, 
            "created_by" integer, 
            "updated_by" integer, 
            "deleted_by" integer, 
            "key_id" integer, 
            CONSTRAINT "PK_ec26783b15ff14e65563103d02f" PRIMARY KEY ("id")
        );

        ALTER TABLE "lov" ADD CONSTRAINT "FK_6efc31464086d02ae5d27f80266" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "lov" ADD CONSTRAINT "FK_f14f2465aaf7eb04839a63284fe" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "lov" ADD CONSTRAINT "FK_8370284f0c8a049a6984d39f2b9" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        
        ALTER TABLE "lov_detail" ADD CONSTRAINT "FK_342212da6d20ede8079e750ccb9" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "lov_detail" ADD CONSTRAINT "FK_ee49ac029761cb686abd533648e" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "lov_detail" ADD CONSTRAINT "FK_4c51b8cee7c4345570ecf4e01d5" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "lov_detail" ADD CONSTRAINT "FK_f29d5f6433252d49cdec4d43f62" FOREIGN KEY ("key_id") REFERENCES "lov"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

        INSERT INTO LOV (id, key, description) VALUES ('1', 'document_type', 'Tipo de Documento'); 
        INSERT INTO LOV (id, key, description) VALUES ('2', 'service_type', 'Tipo de Servicio'); 
        INSERT INTO LOV (id, key, description) VALUES ('3', 'currency', 'Moneda'); 
        INSERT INTO LOV (id, key, description) VALUES ('4', 'complaint_type', 'Tipo de Reclamo'); 

        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('1', '1', 'DNI', 'Documento Nacional de Identificación');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('2', '1', 'CE', 'Carnet de Extranjería');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('3', '1', 'Pasaporte', 'Pasaporte');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('4', '1', 'RUC', 'Registro Único de Contribuyente');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('5', '2', 'Servicio', 'Servicio');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('6', '2', 'Producto', 'Producto');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('7', '3', 'PEN', 'Nuevo Sol Peruano');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('8', '3', 'USD', 'Dolar Americano');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('9', '3', 'EUR', 'Euro');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('10', '4', 'Reclamo', 'Reclamo: Disconformidad relacionada a los productos o servicios');
        INSERT INTO LOV_DETAIL (id, key_id, name, detail) VALUES ('11', '4', 'Queja', 'Queja: Disconformidad no relacionada a los productos o servicios; o malestar o descontento respecto a la atención al público');

        -- Set as default the id_seq to have the id increasing auto
        ALTER TABLE LOV ALTER COLUMN id SET DEFAULT nextval('lov_id_seq');
        ALTER TABLE LOV_DETAIL ALTER COLUMN id SET DEFAULT nextval('lov_detail_id_seq');

        -- Set the start of the id_seq to avoid repeated id
        ALTER SEQUENCE lov_id_seq RESTART WITH 5;
        ALTER SEQUENCE lov_detail_id_seq RESTART WITH 12;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "lov" DROP CONSTRAINT "FK_8370284f0c8a049a6984d39f2b9";
        ALTER TABLE "lov" DROP CONSTRAINT "FK_f14f2465aaf7eb04839a63284fe";
        ALTER TABLE "lov" DROP CONSTRAINT "FK_6efc31464086d02ae5d27f80266";

        ALTER TABLE "lov_detail" DROP CONSTRAINT "FK_f29d5f6433252d49cdec4d43f62";
        ALTER TABLE "lov_detail" DROP CONSTRAINT "FK_4c51b8cee7c4345570ecf4e01d5";
        ALTER TABLE "lov_detail" DROP CONSTRAINT "FK_ee49ac029761cb686abd533648e";
        ALTER TABLE "lov_detail" DROP CONSTRAINT "FK_342212da6d20ede8079e750ccb9";

        DROP INDEX IF EXISTS idx_lov_key;

        DROP TABLE "lov";
        DROP TABLE "lov_detail";
    `);
  }
}
