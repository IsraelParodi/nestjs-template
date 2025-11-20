import { Module } from '@nestjs/common';
import { NotificationsDomainService } from './domain/services/notifications.service';
import { SendgridProvider } from './infrastructure/providers/email/sengrid.provider';
import { NotificationsApplicationService } from './application/services/notifications.service';
import { ConfigModule } from '@nestjs/config';
import sengridConfig from './infrastructure/config/sengrid.config';
import twilioConfig from '@notifications/infrastructure/config/twilio.config';

import { TwilioProvider } from './infrastructure/providers/sms/twilio.provider';
import { EmailProvider } from './infrastructure/providers/email/email.provider';
import { SmsProvider } from './infrastructure/providers/sms/sms.provider';

@Module({
  imports: [
    ConfigModule.forFeature(sengridConfig),
    ConfigModule.forFeature(twilioConfig),
  ],
  providers: [
    NotificationsApplicationService,
    NotificationsDomainService,
    {
      provide: EmailProvider,
      useClass: SendgridProvider,
    },
    {
      provide: SmsProvider,
      useClass: TwilioProvider,
    },
  ],
  exports: [
    NotificationsApplicationService,
    NotificationsDomainService,
    {
      provide: EmailProvider,
      useClass: SendgridProvider,
    },
    {
      provide: SmsProvider,
      useClass: TwilioProvider,
    },
  ],
})
export class NotificationsModule {}
