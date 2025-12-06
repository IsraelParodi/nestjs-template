import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import * as twilio from 'twilio';

import twilioConfig from '@notifications/infrastructure/config/twilio.config';
import { SmsProvider } from './sms.provider';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import { SendSmsType } from '@notifications/infrastructure/types/send-sms.type';

@Injectable()
export class TwilioProvider implements SmsProvider {
  private readonly twilioClient: twilio.Twilio;
  private readonly logger = new Logger(TwilioProvider.name);

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
      throw new InternalServerErrorException(`Cannot send sms to ${recipient}`);
    }
  }
}
