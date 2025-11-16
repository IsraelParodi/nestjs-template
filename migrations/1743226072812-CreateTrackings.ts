import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrackings1743226072812 implements MigrationInterface {
    name = 'CreateTrackings1743226072812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trackings_containers" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "quantity" integer NOT NULL, "kbr" integer NOT NULL, "m3" integer NOT NULL, "description" character varying NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "tracking_id" integer, CONSTRAINT "PK_728255ff0754de87c741f7ad41c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trackings" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "shipper" character varying NOT NULL, "routing" character varying NOT NULL, "customs_office" character varying NOT NULL, "bl_authorization" character varying NOT NULL, "regime" character varying NOT NULL, "mbl_mawb" character varying NOT NULL, "hbl_mawb" character varying NOT NULL, "origin" character varying NOT NULL, "destination" character varying NOT NULL, "etd" TIMESTAMP NOT NULL, "eta" TIMESTAMP NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "consignee_id" integer, "notifier_id" integer, CONSTRAINT "UQ_3d3dbe52b62f9cd2165e3a159bb" UNIQUE ("routing"), CONSTRAINT "UQ_4fc818595f089cf68210e8c1536" UNIQUE ("mbl_mawb"), CONSTRAINT "UQ_fe0ea0ae95e9723c269fabd0eb0" UNIQUE ("hbl_mawb"), CONSTRAINT "PK_8d2bbd5e716298fa0b70749f9eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trackings_seals" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "container_code" character varying NOT NULL, "description" character varying NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "tracking_id" integer, CONSTRAINT "PK_d5a86bfedd315d0bdaf6c6bb46f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" ADD CONSTRAINT "FK_d38c40bae13e33caf0d5d70fef6" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" ADD CONSTRAINT "FK_94e69048593755ab326ba0994ac" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" ADD CONSTRAINT "FK_1ab554a72edeb0b014a5ffcb3a0" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" ADD CONSTRAINT "FK_59a3bf343f349260ca1449c2e34" FOREIGN KEY ("tracking_id") REFERENCES "trackings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings" ADD CONSTRAINT "FK_188870aebfd312c06b74c651537" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings" ADD CONSTRAINT "FK_ec7d5c2bedefe5b4c3b02d59daf" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings" ADD CONSTRAINT "FK_04d2d8162696bba012dee12fc3e" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings" ADD CONSTRAINT "FK_457e85a02ee8bb46527df409e84" FOREIGN KEY ("consignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings" ADD CONSTRAINT "FK_476b1a053cbb37d5bc9aa874b8f" FOREIGN KEY ("notifier_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings_seals" ADD CONSTRAINT "FK_875a1c6c136aeabc7bcfe9e2a86" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings_seals" ADD CONSTRAINT "FK_1b882f57cb0d3290c5eb275d8ee" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings_seals" ADD CONSTRAINT "FK_c4741aa044ec1ec734ce94b483c" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trackings_seals" ADD CONSTRAINT "FK_81f236d0b8520c3d1ffaf5a55f9" FOREIGN KEY ("tracking_id") REFERENCES "trackings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trackings_seals" DROP CONSTRAINT "FK_81f236d0b8520c3d1ffaf5a55f9"`);
        await queryRunner.query(`ALTER TABLE "trackings_seals" DROP CONSTRAINT "FK_c4741aa044ec1ec734ce94b483c"`);
        await queryRunner.query(`ALTER TABLE "trackings_seals" DROP CONSTRAINT "FK_1b882f57cb0d3290c5eb275d8ee"`);
        await queryRunner.query(`ALTER TABLE "trackings_seals" DROP CONSTRAINT "FK_875a1c6c136aeabc7bcfe9e2a86"`);
        await queryRunner.query(`ALTER TABLE "trackings" DROP CONSTRAINT "FK_476b1a053cbb37d5bc9aa874b8f"`);
        await queryRunner.query(`ALTER TABLE "trackings" DROP CONSTRAINT "FK_457e85a02ee8bb46527df409e84"`);
        await queryRunner.query(`ALTER TABLE "trackings" DROP CONSTRAINT "FK_04d2d8162696bba012dee12fc3e"`);
        await queryRunner.query(`ALTER TABLE "trackings" DROP CONSTRAINT "FK_ec7d5c2bedefe5b4c3b02d59daf"`);
        await queryRunner.query(`ALTER TABLE "trackings" DROP CONSTRAINT "FK_188870aebfd312c06b74c651537"`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" DROP CONSTRAINT "FK_59a3bf343f349260ca1449c2e34"`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" DROP CONSTRAINT "FK_1ab554a72edeb0b014a5ffcb3a0"`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" DROP CONSTRAINT "FK_94e69048593755ab326ba0994ac"`);
        await queryRunner.query(`ALTER TABLE "trackings_containers" DROP CONSTRAINT "FK_d38c40bae13e33caf0d5d70fef6"`);
        await queryRunner.query(`DROP TABLE "trackings_seals"`);
        await queryRunner.query(`DROP TABLE "trackings"`);
        await queryRunner.query(`DROP TABLE "trackings_containers"`);
    }

}
