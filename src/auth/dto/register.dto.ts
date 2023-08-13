import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty()
  first_name: string

  @ApiProperty()
  last_name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @MinLength(6)
  password: string

  @ApiProperty()
  @IsNumber()
  status: number
}
