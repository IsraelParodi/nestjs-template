import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComplains1738674342126 implements MigrationInterface {
  name = 'Migrations1738674342126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "complains" (
            "id" SERIAL NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, "code" character varying, 
            "status" character varying NOT NULL DEFAULT 'PENDING', 
            "national_taxpayer_registry" character varying NOT NULL, 
            "company_name" character varying NOT NULL, 
            "document_type" character varying NOT NULL, 
            "document_number" character varying NOT NULL, 
            "complainer_name" character varying NOT NULL, 
            "complainer_address" character varying NOT NULL, 
            "complainer_district" character varying NOT NULL, 
            "complainer_phone" character varying NOT NULL, 
            "complainer_email" character varying NOT NULL, 
            "service_type" character varying NOT NULL, 
            "currency" character varying NOT NULL, 
            "amount_complained" numeric NOT NULL, 
            "description" character varying NOT NULL, 
            "type" character varying NOT NULL, 
            "detail" character varying NOT NULL, 
            "request" character varying NOT NULL, 
            "emails_copied" text NOT NULL DEFAULT '', 
            "created_by" integer, 
            "updated_by" integer, 
            "deleted_by" integer, 
            "complainer_state" integer, 
            "complainer_country" integer, 
            CONSTRAINT "UQ_6e50e52770f186864756d8d8971" UNIQUE ("code"), 
            CONSTRAINT "PK_6e81146e25921255f5efd3cd57a" PRIMARY KEY ("id")
        );

        ALTER TABLE "complains" ADD CONSTRAINT "FK_eaa2677a3e6ef2356e799377131" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "complains" ADD CONSTRAINT "FK_4037849a3fdc5ae578c76d2e908" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "complains" ADD CONSTRAINT "FK_6bc8355eead3efeb67fb8624455" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "complains" ADD CONSTRAINT "FK_38ce7403a4820aefc08a4125acb" FOREIGN KEY ("complainer_state") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "complains" ADD CONSTRAINT "FK_30cdc8bfb97c2630ac405e7b549" FOREIGN KEY ("complainer_country") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "complains" DROP CONSTRAINT "FK_30cdc8bfb97c2630ac405e7b549";
        ALTER TABLE "complains" DROP CONSTRAINT "FK_38ce7403a4820aefc08a4125acb";
        ALTER TABLE "complains" DROP CONSTRAINT "FK_6bc8355eead3efeb67fb8624455";
        ALTER TABLE "complains" DROP CONSTRAINT "FK_4037849a3fdc5ae578c76d2e908";
        ALTER TABLE "complains" DROP CONSTRAINT "FK_eaa2677a3e6ef2356e799377131";
        DROP TABLE "complains";
    `);
  }
}
