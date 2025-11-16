import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneCodeComplains1746159244135 implements MigrationInterface {
    name = 'AddPhoneCodeComplains1746159244135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "complains" ADD "complainer_phone_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "complains" DROP COLUMN "complainer_phone_code"`);
    }

}
