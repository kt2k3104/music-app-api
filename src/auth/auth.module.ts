import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtStratery } from './strateries'
import { JwtRefreshStratery } from './strateries/jwt-refresh.stratery'

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService, JwtStratery, JwtRefreshStratery]
})
export class AuthModule {}
