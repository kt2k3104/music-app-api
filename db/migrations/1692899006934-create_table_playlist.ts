import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePlaylist1692899006934 implements MigrationInterface {
    name = 'CreateTablePlaylist1692899006934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_e782a10b07ed354029b0738ea5c\``);
        await queryRunner.query(`CREATE TABLE \`playlist\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NULL, \`is_public\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`playlist_songs_song\` (\`playlistId\` int NOT NULL, \`songId\` int NOT NULL, INDEX \`IDX_3e66846398a681262e56574fc9\` (\`playlistId\`), INDEX \`IDX_efc8204ff6cdd9f17e83f8d001\` (\`songId\`), PRIMARY KEY (\`playlistId\`, \`songId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`playlist\` ADD CONSTRAINT \`FK_92ca9b9b5394093adb6e5f55c4b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_e782a10b07ed354029b0738ea5c\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`playlist_songs_song\` ADD CONSTRAINT \`FK_3e66846398a681262e56574fc99\` FOREIGN KEY (\`playlistId\`) REFERENCES \`playlist\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`playlist_songs_song\` ADD CONSTRAINT \`FK_efc8204ff6cdd9f17e83f8d001e\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`playlist_songs_song\` DROP FOREIGN KEY \`FK_efc8204ff6cdd9f17e83f8d001e\``);
        await queryRunner.query(`ALTER TABLE \`playlist_songs_song\` DROP FOREIGN KEY \`FK_3e66846398a681262e56574fc99\``);
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` DROP FOREIGN KEY \`FK_e782a10b07ed354029b0738ea5c\``);
        await queryRunner.query(`ALTER TABLE \`playlist\` DROP FOREIGN KEY \`FK_92ca9b9b5394093adb6e5f55c4b\``);
        await queryRunner.query(`DROP INDEX \`IDX_efc8204ff6cdd9f17e83f8d001\` ON \`playlist_songs_song\``);
        await queryRunner.query(`DROP INDEX \`IDX_3e66846398a681262e56574fc9\` ON \`playlist_songs_song\``);
        await queryRunner.query(`DROP TABLE \`playlist_songs_song\``);
        await queryRunner.query(`DROP TABLE \`playlist\``);
        await queryRunner.query(`ALTER TABLE \`user_favorite_songs_song\` ADD CONSTRAINT \`FK_e782a10b07ed354029b0738ea5c\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
