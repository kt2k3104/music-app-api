import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileldAvatarToUserTable1691770860006 implements MigrationInterface {
    name = 'AddFileldAvatarToUserTable1691770860006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
