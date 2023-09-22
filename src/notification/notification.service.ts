import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from './entities/notification.entity'

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Notification) private notiRepo: Repository<Notification>) {}

  async getAllNotiByUserId(userId: number) {
    return await this.notiRepo.find({
      where: {
        user: {
          id: userId
        }
      },
      order: {
        created_at: 'DESC'
      }
    })
  }
}
