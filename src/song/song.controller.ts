import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { CreateBulkSongDto } from './dto/create-bulk-song.dto'
import { SongService } from './song.service'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('songs')
export class SongController {
  constructor(private songService: SongService) {}

  @UseGuards(AuthGuard)
  @Post('bulk')
  createBulk(@Request() req: any, @Body() createBulkSongDto: CreateBulkSongDto): Promise<any> {
    return this.songService.createBulk(createBulkSongDto, req.user_data.id)
  }

  @Get()
  getAllSong(): Promise<any> {
    return this.songService.getAllSong()
  }
}
