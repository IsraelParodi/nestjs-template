import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFeeExpenseEntity1744778185048 implements MigrationInterface {
    name = 'UpdateFeeExpenseEntity1744778185048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees_expenses" ADD "amount" numeric`);
        await queryRunner.query(`ALTER TABLE "fees_expenses" ADD "title" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees_expenses" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "fees_expenses" DROP COLUMN "amount"`);
    }

}
