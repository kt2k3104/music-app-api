import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from 'db/data-source'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { SongModule } from './song/song.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SongModule,
    CloudinaryModule
  ]
})
export class AppModule {}
