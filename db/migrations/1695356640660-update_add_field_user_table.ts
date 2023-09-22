import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddFieldUserTable1695356640660 implements MigrationInterface {
    name = 'UpdateAddFieldUserTable1695356640660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_type\` varchar(255) NOT NULL DEFAULT 'local'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_type\``);
    }

}
