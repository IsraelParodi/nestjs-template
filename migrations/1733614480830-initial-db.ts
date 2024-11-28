import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDb1733614480830 implements MigrationInterface {
  name = 'InitialDb1733614480830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"),
                CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
            );

            CREATE TABLE "roles" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            );

            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "role_id" integer,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            );

            CREATE TABLE "tokens" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "token_id" uuid NOT NULL,
                CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id")
            );

            CREATE TABLE "roles_permissions" (
                "role_id" integer NOT NULL,
                "permission_id" integer NOT NULL,
                CONSTRAINT "PK_0cd11f0b35c4d348c6ebb9b36b7" PRIMARY KEY ("role_id", "permission_id")
            );

            CREATE INDEX "IDX_7d2dad9f14eddeb09c256fea71" ON "roles_permissions" ("role_id");
            CREATE INDEX "IDX_337aa8dba227a1fe6b73998307" ON "roles_permissions" ("permission_id");

            ALTER TABLE "permissions" ADD CONSTRAINT "FK_c398f7100db3e0d9b6a6cd6beaf" FOREIGN KEY ("created_by") REFERENCES "users"("id");
            ALTER TABLE "permissions" ADD CONSTRAINT "FK_58fae278276b7c2c6dde2bc19a5" FOREIGN KEY ("updated_by") REFERENCES "users"("id");
            ALTER TABLE "permissions" ADD CONSTRAINT "FK_3f68a7c4f4123349df00186d7e7" FOREIGN KEY ("deleted_by") REFERENCES "users"("id");

            ALTER TABLE "roles" ADD CONSTRAINT "FK_4a39f3095781cdd9d6061afaae5" FOREIGN KEY ("created_by") REFERENCES "users"("id");
            ALTER TABLE "roles" ADD CONSTRAINT "FK_747b580d73db0ad78963d78b076" FOREIGN KEY ("updated_by") REFERENCES "users"("id");
            ALTER TABLE "roles" ADD CONSTRAINT "FK_6afbac9a2aa8004821807ed92c8" FOREIGN KEY ("deleted_by") REFERENCES "users"("id");

            ALTER TABLE "users" ADD CONSTRAINT "FK_f32b1cb14a9920477bcfd63df2c" FOREIGN KEY ("created_by") REFERENCES "users"("id");
            ALTER TABLE "users" ADD CONSTRAINT "FK_b75c92ef36f432fe68ec300a7d4" FOREIGN KEY ("updated_by") REFERENCES "users"("id");
            ALTER TABLE "users" ADD CONSTRAINT "FK_021e2c9d9dca9f0885e8d738326" FOREIGN KEY ("deleted_by") REFERENCES "users"("id");
            ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id");

            ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_337aa8dba227a1fe6b73998307b" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id");
            INSERT INTO ROLES (id, name) VALUES (1, 'admin')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_337aa8dba227a1fe6b73998307b";
        ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719";
        ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1";
        ALTER TABLE "users" DROP CONSTRAINT "FK_021e2c9d9dca9f0885e8d738326";
        ALTER TABLE "users" DROP CONSTRAINT "FK_b75c92ef36f432fe68ec300a7d4";
        ALTER TABLE "users" DROP CONSTRAINT "FK_f32b1cb14a9920477bcfd63df2c";
        ALTER TABLE "roles" DROP CONSTRAINT "FK_6afbac9a2aa8004821807ed92c8";
        ALTER TABLE "roles" DROP CONSTRAINT "FK_747b580d73db0ad78963d78b076";
        ALTER TABLE "roles" DROP CONSTRAINT "FK_4a39f3095781cdd9d6061afaae5";
        ALTER TABLE "permissions" DROP CONSTRAINT "FK_3f68a7c4f4123349df00186d7e7";
        ALTER TABLE "permissions" DROP CONSTRAINT "FK_58fae278276b7c2c6dde2bc19a5";
        ALTER TABLE "permissions" DROP CONSTRAINT "FK_c398f7100db3e0d9b6a6cd6beaf";
        DROP INDEX "public"."IDX_337aa8dba227a1fe6b73998307";
        DROP INDEX "public"."IDX_7d2dad9f14eddeb09c256fea71";
        DROP TABLE "roles_permissions";
        DROP TABLE "tokens";
        DROP TABLE "users";
        DROP TABLE "roles";
        DROP TABLE "permissions";
    `);
  }
}
