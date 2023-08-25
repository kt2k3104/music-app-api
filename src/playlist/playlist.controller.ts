import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PlaylistService } from './playlist.service'
import { CreatePlaylistDto } from './dto/create-playlist.dto'
import { UpdatePlaylistDto } from './dto/update-playlist.dto'
import { AddSongDto } from './dto/add-song.dto'
import { RemoveSongDto } from './dto/remove-song.dto'

@ApiBearerAuth()
@ApiTags('User')
@Controller('playlists')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async create(@Request() req: any, @Body() createPlaylistDto: CreatePlaylistDto): Promise<any> {
    return {
      success: true,
      result: await this.playlistService.create(createPlaylistDto, req.user.id)
    }
  }

  @Get()
  async getAllByUserId(@Request() req: any): Promise<any> {
    return {
      success: true,
      result: await this.playlistService.getAllByUserId(req.user.id)
    }
  }

  @Get(':id')
  async getById(@Request() req: any, @Param('id', ParseIntPipe) playlistId: number): Promise<any> {
    return {
      success: true,
      result: await this.playlistService.getById(playlistId, req.user.id)
    }
  }

  @UsePipes(ValidationPipe)
  @Put(':id')
  async update(
    @Request() req: any,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
    @Param('id', ParseIntPipe) playlistId: number
  ): Promise<any> {
    return {
      success: true,
      result: await this.playlistService.update(updatePlaylistDto, playlistId, req.user.id)
    }
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id', ParseIntPipe) playlistId: number): Promise<any> {
    return {
      success: true,
      result: await this.playlistService.delete(playlistId, req.user.id)
    }
  }

  @UsePipes(ValidationPipe)
  @Patch('add')
  async addSong(@Request() req: any, @Body() addSongDto: AddSongDto): Promise<any> {
    console.log(addSongDto)
    return {
      success: true,
      result: await this.playlistService.addSong(addSongDto, req.user.id)
    }
  }

  @UsePipes(ValidationPipe)
  @Patch('remove')
  async removeSong(@Request() req: any, @Body() removeSongDto: RemoveSongDto): Promise<any> {
    console.log(removeSongDto)
    return {
      success: true,
      result: await this.playlistService.removeSong(removeSongDto, req.user.id)
    }
  }
}
