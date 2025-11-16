import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuotations1739330776933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "quotations" (
            "id" SERIAL PRIMARY KEY, 
            "name" character varying NOT NULL, 
            "lastname" character varying NOT NULL, 
            "user_type" character varying NOT NULL, 
            "email" character varying NOT NULL, 
            "phone" character varying NOT NULL, 
            "transport_type" character varying NOT NULL, 
            "industry_type" character varying NOT NULL, 
            "country" integer NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, 
            "created_by" integer, 
            "updated_by" integer, 
            "deleted_by" integer
        );

        ALTER TABLE "quotations" ADD CONSTRAINT "quotations_country_fkey" FOREIGN KEY ("country") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "quotations" ADD CONSTRAINT "quotations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "quotations" ADD CONSTRAINT "quotations_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO LOV (key, description) VALUES ('transport_type', 'Tipo de Transporte'); 
        INSERT INTO LOV (key, description) VALUES ('user_type', 'Tipo de usuario'); 
        INSERT INTO LOV (key, description) VALUES ('industry_type', 'Tipo de industria'); 

        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (5, 'Transporte aéreo', 'Transporte aéreo');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (5, 'Transporte marítimo', 'Transporte marítimo');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (5, 'Transporte terrestre', 'Transporte terrestre');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (5, 'Soluciones adicionales', 'Soluciones adicionales');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (6, 'Persona Natural', 'Persona Natural');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (6, 'Persona Jurídica', 'Persona Jurídica');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (6, 'Freight Forwarder', 'Freight Forwarder');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Aeroespacial / Aerospace', 'Aeroespacial / Aerospace');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Bebidas / Beverage', 'Bebidas / Beverage');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Químicos / Chemicals', 'Químicos / Chemicals');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Consumo / Consumer', 'Consumo / Consumer');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Moda / Fashion', 'Moda / Fashion');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Bienes industriales / Industrial Goods', 'Bienes industriales / Industrial Goods');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Salud / Healthcare', 'Salud / Healthcare');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Construcción / Construction', 'Construcción / Construction');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Automotriz / Automotive', 'Automotriz / Automotive');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Agricultura y Silvicultura / Agriculture & Forestry', 'Agricultura y Silvicultura / Agriculture & Forestry');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Manufactura / Manufacturing', 'Manufactura / Manufacturing');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Logística / Logistics', 'Logística / Logistics');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Mineria / Mining', 'Mineria / Mining');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Perecederos y Alimentos / Perishables & Food', 'Perecederos y Alimentos / Perishables & Food');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Venta al por menor / Retail', 'Venta al por menor / Retail');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Tecnología / Technology', 'Tecnología / Technology');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Petróleo y Gas / Oil & Gas', 'Petróleo y Gas / Oil & Gas');
        INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES (7, 'Otro / Other', 'Otro / Other');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM LOV_DETAIL WHERE key_id IN (5, 6, 7);
        DELETE FROM LOV WHERE key IN ('transport_type', 'user_type', 'industry_type');

        ALTER TABLE "complains" DROP CONSTRAINT IF EXISTS "quotations_country_fkey";
        ALTER TABLE "complains" DROP CONSTRAINT IF EXISTS "quotations_created_by_fkey";
        ALTER TABLE "complains" DROP CONSTRAINT IF EXISTS "quotations_updated_by_fkey";
        ALTER TABLE "complains" DROP CONSTRAINT IF EXISTS "quotations_deleted_by_fkey";


        -- Set as default the id_seq to have the id increasing auto
        ALTER TABLE LOV ALTER COLUMN id SET DEFAULT nextval('lov_id_seq');
        ALTER TABLE LOV_DETAIL ALTER COLUMN id SET DEFAULT nextval('lov_detail_id_seq');

        -- Set the start of the id_seq to avoid repeated id
        ALTER SEQUENCE lov_id_seq RESTART WITH 5;
        ALTER SEQUENCE lov_detail_id_seq RESTART WITH 12;

        DROP TABLE IF EXISTS "quotations";
    `);
  }
}
