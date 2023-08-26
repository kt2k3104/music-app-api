import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from 'db/data-source'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { SongModule } from './song/song.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { User } from './user/entities/user.entity'
import { PlaylistModule } from './playlist/playlist.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt.guard'
import { RolesGuard } from './auth/guards/roles.guard'

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SongModule,
    CloudinaryModule,
    TypeOrmModule.forFeature([User]),
    PlaylistModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
