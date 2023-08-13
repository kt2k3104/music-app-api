import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  first_name: string

  @ApiProperty()
  last_name: string

  @ApiProperty()
  @IsNumber()
  status: number
}
