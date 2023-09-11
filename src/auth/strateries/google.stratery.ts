import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Profile, Strategy } from 'passport-google-oauth20'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIEND_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIEND_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email']
    })
  }
  async validate(accesToken: string, refreshToken: string, profile: Profile) {
    const user = await this.userRepo.findOneBy({ email: profile.emails[0].value })
    console.log(user)

    if (!user) {
      return await this.userRepo.save({
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        password: 'google',
        avater: profile.photos[0].value
      })
    }

    return user
  }
}
