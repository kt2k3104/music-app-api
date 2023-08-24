import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Song } from './entities/song.entity'
import { Repository } from 'typeorm'
import { CreateBulkSongDto } from './dto/create-bulk-song.dto'
import { User } from 'src/user/entities/user.entity'
import { CreateSongDto } from './dto/create-song.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { UpdateSongDto } from './dto/update-song.dto'
@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private cloudinary: CloudinaryService
  ) {}

  async create(createSongDto: CreateSongDto, userId: number): Promise<any> {
    const user = await this.userRepo.findOneBy({ id: userId })

    return await this.songRepo.save({ ...createSongDto, user })
  }

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
    return await this.songRepo.find({
      relations: {
        user: true
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true
        }
      }
    })
  }

  async getSong(songId: number): Promise<any> {
    const song = await this.songRepo.findOne({
      where: { id: songId },
      relations: {
        user: true
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true
        }
      }
    })

    if (!song) {
      throw new HttpException('Song not found!!', HttpStatus.NOT_FOUND)
    }
    return song
  }

  async getSongByUserId(userId: number): Promise<any> {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: { songs: true }
      })
      if (!user) {
        throw new HttpException('user not found !', HttpStatus.NOT_FOUND)
      }
      console.log(user)
      return user.songs
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async update(updateSongDto: UpdateSongDto, songId: number, userId: number): Promise<any> {
    const song = await this.songRepo.findOne({
      where: { id: songId },
      relations: {
        user: true
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true
        }
      }
    })

    if (song.user.id !== userId) {
      throw new BadRequestException('You do not have permission!')
    }

    return this.songRepo.update(songId, updateSongDto)
  }

  async delete(songId: number, userId: number): Promise<any> {
    const song = await this.songRepo.findOne({
      where: {
        id: songId
      },
      relations: {
        user: true
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true
        }
      }
    })

    if (song) {
      if (song.user.id !== userId) {
        throw new BadRequestException('You do not have permission!')
      }

      await this.cloudinary.destroyFile(song.url, 'audio')
      await this.cloudinary.destroyFile(song.artwork, 'image-art')
    }

    return this.songRepo.delete(songId)
  }

  async changeFavorite(userId: number, songId: number): Promise<any> {
    try {
      let isFavorited: number = -1
      const song = await this.songRepo.findOneBy({ id: songId })
      if (!song) {
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND)
      }
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: { favoriteSongs: true },
        select: ['id', 'first_name', 'last_name', 'email', 'role', 'avatar']
      })

      if (user) {
        console.log(user)
        isFavorited = user.favoriteSongs.findIndex(item => {
          return item.id === song.id
        })

        console.log(isFavorited)

        if (isFavorited > -1) {
          user.favoriteSongs = user.favoriteSongs.filter(item => item.id !== song.id)
        } else {
          console.log('push')
          user.favoriteSongs.push(song)
        }
      }

      return {
        success: true,
        result: {
          favorited: isFavorited > -1 ? false : true,
          response: await this.userRepo.save(user)
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
