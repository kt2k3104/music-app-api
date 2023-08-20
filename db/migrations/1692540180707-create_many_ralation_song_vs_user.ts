import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateManyRalationSongVsUser1692540180707 implements MigrationInterface {
    name = 'CreateManyRalationSongVsUser1692540180707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_favorite_songs_song\` (\`userId\` int NOT NULL, \`songId\` int NOT NULL, INDEX \`IDX_c717cf594798f1e77d891e549b\` (\`userId\`), INDEX \`IDX_e782a10b07ed354029b0738ea5\` (\`songId\`), PRIMARY KEY (\`userId\`, \`songId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_c717cf594798f1e77d891e549b5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_e782a10b07ed354029b0738ea5c\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_e782a10b07ed354029b0738ea5c\``);
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_c717cf594798f1e77d891e549b5\``);
        await queryRunner.query(`DROP INDEX \`IDX_e782a10b07ed354029b0738ea5\` ON \`user_favorite_songs_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_c717cf594798f1e77d891e549b\` ON \`user_favorite_songs_song\``);
        await queryRunner.query(`DROP TABLE \`user_favorite_songs_song\``);
    }

}
