import { Module } from '@nestjs/common'
import { SongController } from './song.controller'
import { SongService } from './song.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Song } from './entities/song.entity'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Song, User])],
  controllers: [SongController],
  providers: [SongService]
})
export class SongModule {}
