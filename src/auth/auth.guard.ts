import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) return true

    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY')
      })
      const user = await this.userRepo.findOne({
        where: { id: payload.id },
        select: [
          'id',
          'first_name',
          'last_name',
          'email',
          'role',
          'avatar',
          'created_at',
          'updated_at'
        ]
      })
      request['user'] = user
    } catch (error) {
      throw new HttpException({ status: 419, message: 'token expired' }, 419)
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization
      ? request.headers.authorization.split(' ')
      : []

    return type === 'Bearer' ? token : undefined
  }
}
