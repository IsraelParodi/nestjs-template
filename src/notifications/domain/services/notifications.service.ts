import { Injectable, Logger } from '@nestjs/common';
import { EmailProvider } from '@notifications/infrastructure/providers/email/email.provider';
import { SmsProvider } from '@notifications/infrastructure/providers/sms/sms.provider';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';
import { NotificationChannelEnum } from 'src/notifications/infrastructure/enums/notification-channel.enum';

@Injectable()
export class NotificationsDomainService {
  private readonly logger = new Logger(NotificationsDomainService.name);

  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly smsProvider: SmsProvider,
  ) {}

  async send(params: SendNotificationType) {
    if (params.channel == NotificationChannelEnum.EMAIL) {
      await this.emailProvider.send(params);
    }

    if (params.channel == NotificationChannelEnum.SMS) {
      await this.smsProvider.send(params);
    }

    this.logger.log(`NotificationDomainService request by ${params.channel} channel`);
    this.logger.log(`NotificationDomainService requested with data: ${JSON.stringify(params)}`);
  }
}
