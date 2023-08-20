import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, IsUrl } from 'class-validator'

export class CreateSongDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  artwork: string

  @ApiProperty()
  @IsNotEmpty()
  artist: string

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  duration: number
}
