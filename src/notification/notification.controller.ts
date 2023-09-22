import { Controller, Get } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { GetUserRequest } from 'src/auth/decorators'
import { User } from 'src/user/entities/user.entity'

@Controller('notifications')
export class NotificationController {
  constructor(private notiService: NotificationService) {}

  @Get()
  async getAll(@GetUserRequest() user: User) {
    return {
      success: true,
      result: await this.notiService.getAllNotiByUserId(user.id)
    }
  }
}
