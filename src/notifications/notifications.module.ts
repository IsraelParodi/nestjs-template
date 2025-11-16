import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import sengridConfig from './infrastructure/config/sengrid.config';
import twilioConfig from '@notifications/infrastructure/config/twilio.config';

import { TwilioRepository } from './infrastructure/adapters/sms/twilio-sms.sender';
import { EmailSender } from './application/ports/outbound/email.sender';
import { SendgridRepository } from './infrastructure/adapters/email/sendgrid-email.sender';
import { SmsSender } from './application/ports/outbound/sms.sender';

@Module({
  imports: [
    ConfigModule.forFeature(sengridConfig),
    ConfigModule.forFeature(twilioConfig),
  ],
  providers: [
    {
      provide: EmailSender,
      useClass: SendgridRepository,
    },
    {
      provide: SmsSender,
      useClass: TwilioRepository,
    },
  ],
  exports: [SmsSender, EmailSender],
})
export class NotificationsModule {}
