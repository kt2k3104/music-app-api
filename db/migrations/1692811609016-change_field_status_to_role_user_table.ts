import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldStatusToRoleUserTable1692811609016 implements MigrationInterface {
    name = 'ChangeFieldStatusToRoleUserTable1692811609016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`status\` \`role\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`status\` int NOT NULL DEFAULT '1'`);
    }

}
