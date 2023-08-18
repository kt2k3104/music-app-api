import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ApiTags } from '@nestjs/swagger'

interface ResponseAPI<T> {
  success: boolean
  message?: string
  result?: Promise<T>
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log(registerDto)
    try {
      await this.authService.register(registerDto)
      return {
        success: true,
        message: 'Register account success!!'
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const data = await this.authService.login(loginDto)
    return {
      success: true,
      message: 'Login success',
      result: data
    }
  }

  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }): ResponseAPI<any> {
    return {
      success: true,
      result: this.authService.refreshToken(refresh_token)
    }
  }
}
