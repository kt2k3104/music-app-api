import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class RemoveSongDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  songId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  playlistId: number
}
