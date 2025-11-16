import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import * as twilio from 'twilio';

import twilioConfig from '@notifications/infrastructure/config/twilio.config';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import { SendSmsType } from '@notifications/infrastructure/types/send-sms.type';
import { SmsSender } from '@notifications/application/ports/outbound/sms.sender';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';

@Injectable()
export class TwilioRepository implements SmsSender {
  private readonly twilioClient: twilio.Twilio;
  private readonly logger = new Logger(TwilioRepository.name);

  constructor(
    @Inject(twilioConfig.KEY)
    private readonly twilioConfiguration: ConfigType<typeof twilioConfig>,
  ) {
    this.twilioClient = twilio(
      this.twilioConfiguration.apiAccountSid,
      this.twilioConfiguration.apiToken,
    );
  }

  async send(params: SendSmsType) {
    if (
      params.channel == NotificationChannel.SMS &&
      ['PROD', 'TEST'].includes(process.env.APP_ENV)
    ) {
      const { recipient, message } = params;

      const paramsTwilioCreate: MessageListInstanceCreateOptions = {
        to: recipient,
        from: this.twilioConfiguration.apiSender,
        body: message,
      };

      try {
        const smsSent =
          await this.twilioClient.messages.create(paramsTwilioCreate);
        this.logger.log(`SMS sent successfully to ${recipient}`);

        return smsSent;
      } catch (error) {
        this.logger.error(`Cannot send sms to ${recipient}`);
        this.logger.error(`Error: ${JSON.stringify(error)}`);
        throw new InternalServerErrorException(
          `Cannot send sms to ${recipient}`,
        );
      }
    }
  }
}
