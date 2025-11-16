import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactUs1744490297195 implements MigrationInterface {
  name = 'CreateContactUs1744490297195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contact-us" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "message" text NOT NULL, "accept_privacy_policies" boolean NOT NULL DEFAULT true, "receive_additional_information" boolean NOT NULL DEFAULT false, "created_by" integer, "updated_by" integer, "deleted_by" integer, "country" integer, CONSTRAINT "PK_ee74839cf815cb30bb308230760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact-us" ADD CONSTRAINT "FK_efc0d9bf4f672f802296c73bbda" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact-us" ADD CONSTRAINT "FK_af4df15c9eb06c240d55f777662" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact-us" ADD CONSTRAINT "FK_ddaf6805bacd599eb95b48b97e5" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact-us" ADD CONSTRAINT "FK_4b6204dfa571522a72e32c0154e" FOREIGN KEY ("country") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contact-us" DROP CONSTRAINT "FK_4b6204dfa571522a72e32c0154e"`);
    await queryRunner.query(`ALTER TABLE "contact-us" DROP CONSTRAINT "FK_ddaf6805bacd599eb95b48b97e5"`);
    await queryRunner.query(`ALTER TABLE "contact-us" DROP CONSTRAINT "FK_af4df15c9eb06c240d55f777662"`);
    await queryRunner.query(`ALTER TABLE "contact-us" DROP CONSTRAINT "FK_efc0d9bf4f672f802296c73bbda"`);
    await queryRunner.query(`DROP TABLE "contact-us"`);
  }
}
