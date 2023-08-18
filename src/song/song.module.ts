import { Module } from '@nestjs/common'
import { SongController } from './song.controller'
import { SongService } from './song.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Song } from './entities/song.entity'
import { User } from 'src/user/entities/user.entity'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
  imports: [TypeOrmModule.forFeature([Song, User]), CloudinaryModule],
  controllers: [SongController],
  providers: [SongService]
})
export class SongModule {}
