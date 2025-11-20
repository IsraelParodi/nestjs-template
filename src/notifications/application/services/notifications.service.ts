import { Injectable } from '@nestjs/common';
import { NotificationsDomainService } from '@notifications/domain/services/notifications.service';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';

@Injectable()
export class NotificationsApplicationService {
  constructor(
    private readonly notificationsDomainService: NotificationsDomainService,
  ) {}

  async send(params: SendNotificationType) {
    await this.notificationsDomainService.send(params);
  }
}
