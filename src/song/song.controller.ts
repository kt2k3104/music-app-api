import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateBulkSongDto } from './dto/create-bulk-song.dto'
import { SongService } from './song.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { storageConfig } from 'helpers/config'
import { filterAudioConfig, filterImageConfig } from 'helpers/upload-file-config'
import { CreateSongDto } from './dto/create-song.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateSongDto } from './dto/update-song.dto'

@ApiTags('Song')
@Controller('songs')
export class SongController {
  constructor(
    private songService: SongService,
    private cloudinaryService: CloudinaryService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('bulk')
  createBulk(@Request() req: any, @Body() createBulkSongDto: CreateBulkSongDto): Promise<any> {
    return this.songService.createBulk(createBulkSongDto, req.user_data.id)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async create(@Request() req: any, @Body() createSongDto: CreateSongDto) {
    const result = await this.songService.create(createSongDto, req.user_data.id)
    result.user = result.user.id
    return {
      success: true,
      result: result
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('upload-audio')
  @UseInterceptors(
    FileInterceptor('song', {
      storage: storageConfig('audios'),
      fileFilter: filterAudioConfig()
    })
  )
  async uploadAudio(@Request() req: any, @UploadedFile() file: Express.Multer.File): Promise<any> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }
    console.log('vao day ch ??')

    if (!file) {
      throw new BadRequestException('File is required')
    }

    const cloudFile = await this.cloudinaryService.uploadFile(file, 'audio')

    console.log(cloudFile)

    return {
      success: true,
      result: {
        url: cloudFile.url,
        duration: cloudFile.duration
      }
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('upload-art')
  @UseInterceptors(
    FileInterceptor('artwork', {
      storage: storageConfig('artworks'),
      fileFilter: filterImageConfig()
    })
  )
  async uploadArtwork(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }

    if (!file) {
      throw new BadRequestException('File is required')
    }

    const cloudFile = await this.cloudinaryService.uploadFile(file, 'image-art')

    return {
      success: true,
      result: cloudFile.url
    }
  }

  @Get()
  async getAllSong(): Promise<any> {
    return {
      success: true,
      result: await this.songService.getAllSong()
    }
  }

  @Get(':id')
  async getSong(@Param('id', ParseIntPipe) songId: number): Promise<any> {
    return {
      success: true,
      result: await this.songService.getSong(songId)
    }
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getSongByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<any> {
    return {
      success: true,
      result: await this.songService.getSongByUserId(userId)
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) songId: number,
    @Request() req: any,
    @Body() updateSongDto: UpdateSongDto
  ) {
    return {
      success: true,
      result: await this.songService.update(updateSongDto, songId, req.user_data.id)
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) songId: number, @Request() req: any) {
    await this.songService.delete(songId, req.user_data.id)
    return {
      success: true
    }
  }

  @UseGuards(AuthGuard)
  @Get('favorite/:id')
  async changeFavorite(
    @Request() req: any,
    @Param('id', ParseIntPipe) songId: number
  ): Promise<any> {
    try {
      return await this.songService.changeFavorite(req.user_data.id, songId)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
