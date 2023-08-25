import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Song } from 'src/song/entities/song.entity'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import { Playlist } from './entities/playlist.entity'
import { CreatePlaylistDto } from './dto/create-playlist.dto'
import { UpdatePlaylistDto } from './dto/update-playlist.dto'
import { AddSongDto } from './dto/add-song.dto'
import { RemoveSongDto } from './dto/remove-song.dto'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Playlist) private playlistRepo: Repository<Playlist>
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto, userId: number): Promise<any> {
    const user = await this.userRepo.findOneBy({ id: userId })
    if (!user) {
      throw new BadRequestException('Songthing wrong, user not found!!')
    }

    return await this.playlistRepo.save({ ...createPlaylistDto, user })
  }

  async getAllByUserId(userId: number): Promise<any> {
    try {
      return await this.playlistRepo.find({
        where: {
          user: {
            id: userId
          }
        },
        relations: {
          songs: true
        },
        order: {
          songs: {
            name: 'ASC'
          },
          name: 'ASC'
        }
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getById(playlistId: number, userId: number): Promise<any> {
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: {
        songs: true,
        user: true
      },
      select: {
        user: {
          id: true
        }
      },
      order: {
        songs: {
          name: 'ASC'
        }
      }
    })

    if (!playlist) {
      throw new HttpException('Playlist not found !', HttpStatus.NOT_FOUND)
    }

    if (playlist.user.id !== userId) {
      throw new BadRequestException('you can not access this playlist')
    }

    return playlist
  }

  async update(
    updatePlaylistDto: UpdatePlaylistDto,
    playlistId: number,
    userId: number
  ): Promise<any> {
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: {
        user: true
      },
      select: {
        user: {
          id: true
        }
      }
    })

    if (!playlist) {
      throw new HttpException('Playlist not found !', HttpStatus.NOT_FOUND)
    }

    if (playlist.user.id !== userId) {
      throw new BadRequestException('you can not access this playlist')
    }

    return await this.playlistRepo.update(playlistId, updatePlaylistDto)
  }

  async delete(playlistId: number, userId: number): Promise<any> {
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: {
        user: true
      },
      select: {
        user: {
          id: true
        }
      }
    })

    if (!playlist) {
      throw new HttpException('Playlist not found !', HttpStatus.NOT_FOUND)
    }

    if (playlist.user.id !== userId) {
      throw new BadRequestException('you can not access this playlist')
    }

    return this.playlistRepo.delete(playlistId)
  }

  async addSong(addSongDto: AddSongDto, userId: number): Promise<any> {
    const playlist = await this.playlistRepo.findOne({
      where: {
        id: addSongDto.playlistId
      },
      relations: {
        user: true,
        songs: true
      },
      select: {
        user: {
          id: true
        }
      }
    })

    const song = await this.songRepo.findOneBy({ id: addSongDto.songId })

    if (!song) {
      throw new HttpException('Song not found !', HttpStatus.NOT_FOUND)
    }

    if (!playlist) {
      throw new HttpException('Playlist not found !', HttpStatus.NOT_FOUND)
    }

    if (playlist.user.id !== userId) {
      throw new BadRequestException('you can not access this playlist')
    }

    if (!(playlist.songs.findIndex(val => val.id === song.id) > -1)) {
      playlist.songs.push(song)
    } else {
      throw new BadRequestException('Song existed in playlist !')
    }

    return await this.playlistRepo.save(playlist)
  }

  async removeSong(removeSongDto: RemoveSongDto, userId: number): Promise<any> {
    const playlist = await this.playlistRepo.findOne({
      where: {
        id: removeSongDto.playlistId
      },
      relations: {
        user: true,
        songs: true
      },
      select: {
        user: {
          id: true
        }
      }
    })

    const song = await this.songRepo.findOneBy({ id: removeSongDto.songId })

    if (!song) {
      throw new HttpException('Song not found !', HttpStatus.NOT_FOUND)
    }

    if (!playlist) {
      throw new HttpException('Playlist not found !', HttpStatus.NOT_FOUND)
    }

    if (playlist.user.id !== userId) {
      throw new BadRequestException('you can not access this playlist')
    }

    if (playlist.songs.findIndex(val => val.id === song.id) > -1) {
      playlist.songs = playlist.songs.filter(val => val.id !== song.id)
    } else {
      throw new HttpException('Song not existed in playlist !', HttpStatus.NOT_FOUND)
    }

    return await this.playlistRepo.save(playlist)
  }
}