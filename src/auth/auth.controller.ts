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
import { Public } from './decorator/publict.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public(true)
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

  @Public(true)
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

  @Public(true)
  @Post('refresh-token')
  async refreshToken(@Body() body: any): Promise<any> {
    try {
      return {
        success: true,
        result: await this.authService.refreshToken(body.refresh_token)
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
