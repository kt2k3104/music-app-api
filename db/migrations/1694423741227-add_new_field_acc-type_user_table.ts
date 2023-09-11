import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldAccTypeUserTable1694423741227 implements MigrationInterface {
    name = 'AddNewFieldAccTypeUserTable1694423741227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`status\` \`account_type\` varchar(255) NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_type\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_type\` varchar(255) NOT NULL DEFAULT 'local'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_type\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_type\` varchar(255) NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`account_type\` \`status\` varchar(255) NOT NULL DEFAULT 'local'`);
    }

}
