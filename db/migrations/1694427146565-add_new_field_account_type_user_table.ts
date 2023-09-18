import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldAccountTypeUserTable1694427146565 implements MigrationInterface {
    name = 'AddNewFieldAccountTypeUserTable1694427146565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_type\` varchar(255) NOT NULL DEFAULT 'local'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_type\``);
    }

}
