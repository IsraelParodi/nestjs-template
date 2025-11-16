import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFees1741470486527 implements MigrationInterface {
  name = 'CreateFees1741470486527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "states" DROP CONSTRAINT "states_country_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sea_ports" DROP CONSTRAINT "sea_ports_country_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "quotations_country_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "quotations_created_by_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "quotations_updated_by_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "quotations_deleted_by_fkey"`,
    );
    await queryRunner.query(`DROP INDEX "public"."states_country_id_idx"`);
    await queryRunner.query(`DROP INDEX "public"."countries_region_id_idx"`);
    await queryRunner.query(`DROP INDEX "public"."countries_subregion_id_idx"`);
    await queryRunner.query(`DROP INDEX "public"."idx_lov_key"`);
    await queryRunner.query(
      `CREATE TABLE "fees_containers" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "size" character varying NOT NULL, "amount" numeric NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "feeId" integer, CONSTRAINT "PK_99a579415b80f0a16e5fb61f521" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fees_expenses" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "unit" character varying NOT NULL, "description" character varying NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "feeId" integer, CONSTRAINT "PK_ce02cf4b22c329d2403edcbcf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fees" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "currency" character varying NOT NULL, "regime" character varying NOT NULL, "customs_office" character varying NOT NULL, "shipmentType" character varying NOT NULL, "origin" character varying NOT NULL, "destination" character varying NOT NULL, "notes" character varying, "observations" character varying, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_97f3a1b1b8ee5674fd4da93f461" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "states"."wikiDataId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "countries" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "countries"."wikiDataId" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ALTER COLUMN "country" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sea_ports" ADD CONSTRAINT "FK_d18c3a53efc3e2dbe4231debd9a" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "FK_25dcb703da984fa66bde99af598" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "FK_93a8c0e6fb7fc8f2cdf86db1ae4" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "FK_70330f08034605e6050b32f63a7" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "FK_8a927f6686f34ee71e5252182a6" FOREIGN KEY ("country") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" ADD CONSTRAINT "FK_6b06503a321471fd34a4bbe7559" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" ADD CONSTRAINT "FK_9d4b0c558d678762717ba8c0950" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" ADD CONSTRAINT "FK_ad85f2ec85fedfc33e615ffde36" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" ADD CONSTRAINT "FK_aba11a5ffdfc6a26e94eabcd6d6" FOREIGN KEY ("feeId") REFERENCES "fees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" ADD CONSTRAINT "FK_722db513c916db19be2421ea30f" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" ADD CONSTRAINT "FK_1983e604bdf7ab3c431a07bcec7" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" ADD CONSTRAINT "FK_74cb235abbdc8a93fedce57eee5" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" ADD CONSTRAINT "FK_573cc18020c5a4a06c98e0722a9" FOREIGN KEY ("feeId") REFERENCES "fees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees" ADD CONSTRAINT "FK_6b69f3bd75527a53189b1c08a5f" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees" ADD CONSTRAINT "FK_82a9be51dcbdd0f3ebcceb6cedc" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees" ADD CONSTRAINT "FK_71257823f8570f80266f429a15f" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO LOV (key, description) VALUES ('regime', 'Régimen');
             INSERT INTO LOV (key, description) VALUES ('shipping_type', 'Tipo de Embarque');
             INSERT INTO LOV (key, description) VALUES ('customs_office', 'Aduana');
             INSERT INTO LOV (key, description) VALUES ('unit_of_measurement', 'Unidad de Medida');
      
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'regime'), 'Importación', 'Importación');
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'regime'), 'Exportación', 'Exportación');
      
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shipping_type'), 'FCL', 'Full Container Load');
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'shipping_type'), 'LCL', 'Less Than Container Load');
      
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'customs_office'), 'Marítima', 'Marítima');
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'customs_office'), 'Terrestre', 'Terrestre');
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'customs_office'), 'Aérea', 'Aérea');
      
             INSERT INTO LOV_DETAIL (key_id, name, detail) VALUES ((SELECT id FROM LOV WHERE key = 'unit_of_measurement'), 'Unidad', 'und');
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fees" DROP CONSTRAINT "FK_71257823f8570f80266f429a15f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees" DROP CONSTRAINT "FK_82a9be51dcbdd0f3ebcceb6cedc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees" DROP CONSTRAINT "FK_6b69f3bd75527a53189b1c08a5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" DROP CONSTRAINT "FK_573cc18020c5a4a06c98e0722a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" DROP CONSTRAINT "FK_74cb235abbdc8a93fedce57eee5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" DROP CONSTRAINT "FK_1983e604bdf7ab3c431a07bcec7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_expenses" DROP CONSTRAINT "FK_722db513c916db19be2421ea30f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" DROP CONSTRAINT "FK_aba11a5ffdfc6a26e94eabcd6d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" DROP CONSTRAINT "FK_ad85f2ec85fedfc33e615ffde36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" DROP CONSTRAINT "FK_9d4b0c558d678762717ba8c0950"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees_containers" DROP CONSTRAINT "FK_6b06503a321471fd34a4bbe7559"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "FK_8a927f6686f34ee71e5252182a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "FK_70330f08034605e6050b32f63a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "FK_93a8c0e6fb7fc8f2cdf86db1ae4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" DROP CONSTRAINT "FK_25dcb703da984fa66bde99af598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sea_ports" DROP CONSTRAINT "FK_d18c3a53efc3e2dbe4231debd9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ALTER COLUMN "country" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "countries"."wikiDataId" IS 'Rapid API GeoDB Cities'`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries" ALTER COLUMN "created_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "states"."wikiDataId" IS 'Rapid API GeoDB Cities'`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`DROP TABLE "fees"`);
    await queryRunner.query(`DROP TABLE "fees_expenses"`);
    await queryRunner.query(`DROP TABLE "fees_containers"`);
    await queryRunner.query(`CREATE INDEX "idx_lov_key" ON "lov" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "countries_subregion_id_idx" ON "countries" ("subregion_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "countries_region_id_idx" ON "countries" ("region_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "states_country_id_idx" ON "states" ("country_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "quotations_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "quotations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quotations" ADD CONSTRAINT "quotations_country_fkey" FOREIGN KEY ("country") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sea_ports" ADD CONSTRAINT "sea_ports_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" ADD CONSTRAINT "states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      await queryRunner.query(
        `DELETE FROM LOV_DETAIL WHERE key_id IN (
              SELECT key_id FROM LOV WHERE key IN ('regime', 'shipping_type', 'customs_office', 'unit_of_measurement')
          );
  
          DELETE FROM LOV WHERE key IN ('regime', 'shipping_type', 'customs_office', 'unit_of_measurement');
          `,
      ),
    );
  }
}
