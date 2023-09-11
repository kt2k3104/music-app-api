import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, IsNumber } from 'class-validator'

export class RemoveSongDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  // @IsNumber()
  songId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  // @IsNumber()
  playlistId: number
}
