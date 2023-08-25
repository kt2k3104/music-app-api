import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class AddSongDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  songId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  playlistId: number
}
