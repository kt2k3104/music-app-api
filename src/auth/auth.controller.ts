import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ApiTags } from '@nestjs/swagger'
import { User } from 'src/user/entities/user.entity'
import { GetUserRequest, Public } from './decorators'
import { GoogleAuthGuard } from './guards/google.guard'

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

  @Post('refresh-token')
  async refreshToken(@GetUserRequest() user: User): Promise<any> {
    console.log(user)
    return {
      success: true,
      result: await this.authService.refreshToken(user)
    }
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @Public(true)
  googleLogin() {
    return {
      message: 'authenticated'
    }
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @Public(true)
  async googleLoginRedirect(@GetUserRequest() user: User) {
    console.log(user)
    const tokens = await this.authService.generateToken({ id: user.id, email: user.email })
    const htmlWithEmbeddedJWT = `
    <html>
      <script>
        // Redirect browser to root of application
        window.location.href = 'http://localhost:3000/login/success?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}';
      </script>
    </html>
    `

    return htmlWithEmbeddedJWT
  }
}
