import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Song } from './entities/song.entity'
import { Repository } from 'typeorm'
import { CreateBulkSongDto } from './dto/create-bulk-song.dto'
import { User } from 'src/user/entities/user.entity'
@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async createBulk(createBulkSongDto: CreateBulkSongDto, userId: number): Promise<any> {
    const user = await this.userRepo.findOneBy({ id: userId })
    let bulkData = []

    if (user) {
      bulkData = createBulkSongDto.songs.map(song => {
        return {
          ...song,
          user
        }
      })

      console.log(bulkData)
    }

    return await this.songRepo.createQueryBuilder().insert().into(Song).values(bulkData).execute()
  }

  async getAllSong(): Promise<any> {
    return await this.songRepo.find()
  }
}
