import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSongTable1691927636130 implements MigrationInterface {
    name = 'CreateSongTable1691927636130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`song\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`artwork\` varchar(255) NOT NULL, \`artist\` varchar(255) NOT NULL, \`duration\` int NULL, \`url\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_1cf2820b0e3f5962ee67ec19159\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_1cf2820b0e3f5962ee67ec19159\``);
        await queryRunner.query(`DROP TABLE \`song\``);
    }

}
