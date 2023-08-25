import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtSercive: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ email: registerDto.email })

    if (user) {
      throw new HttpException(
        'ER_EMAIL_HAD_ACC: Email already have an account',
        HttpStatus.BAD_REQUEST
      )
    }

    const hashPassword = await this.hashPassword(registerDto.password)

    return await this.userRepo.save({
      ...registerDto,
      password: hashPassword
    })
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email: loginDto.email })
      .addSelect('user.password')
      .getOne()

    if (!user) {
      throw new HttpException('ER_EMAIL_NOTF: Email is not exist', HttpStatus.UNAUTHORIZED)
    }

    const checkPass = bcrypt.compareSync(loginDto.password, user.password)
    if (!checkPass) {
      throw new HttpException('ER_PASS_IN_COR: Is password is not correct', HttpStatus.UNAUTHORIZED)
    }

    // generate access token and refresh token
    const payload = { id: user.id, email: user.email }

    const tokens = await this.generateToken(payload)

    return { tokens, id: user.id }
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtSercive.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY')
      })
      const checkToken = await this.userRepo.findOneBy({ email: verify.email, refresh_token })
      console.log(checkToken)
      if (checkToken) {
        return this.generateToken({ id: verify.id, email: verify.email })
      } else {
        throw new HttpException('Refresh token is not validddd', HttpStatus.BAD_REQUEST)
      }
    } catch (error) {
      throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
    }
  }

  private async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.jwtSercive.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXP_IN')
    })
    const refresh_token = await this.jwtSercive.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXP_IN')
    })
    await this.userRepo.update({ email: payload.email }, { refresh_token: refresh_token })

    return { access_token, refresh_token }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const hash = await bcrypt.hash(password, salt)

    return hash
  }
}
