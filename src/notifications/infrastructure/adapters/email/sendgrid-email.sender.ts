import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import sengridConfig from '@notifications/infrastructure/config/sengrid.config';
import { ConfigType } from '@nestjs/config';
import { SendEmailType } from '@notifications/infrastructure/types/send-email.type';
import { EmailSender } from '../../../application/ports/outbound/email.sender';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';

@Injectable()
export class SendgridRepository implements EmailSender {
  private readonly logger = new Logger(SendgridRepository.name);

  constructor(
    @Inject(sengridConfig.KEY)
    private readonly sendgridConfiguration: ConfigType<typeof sengridConfig>,
  ) {
    sgMail.setApiKey(sendgridConfiguration.apiKey);
  }

  async send(params: SendEmailType) {
    if (
      params.channel == NotificationChannel.EMAIL &&
      ['PROD', 'TEST'].includes(process.env.APP_ENV)
    ) {
      const { message, recipient, templateId, subject } = params;

      const sendEmail: sgMail.MailDataRequired = {
        templateId,
        from: this.sendgridConfiguration.apiSender,
        to: recipient,
        dynamicTemplateData: { ...message.body, subject },
        mailSettings: {
          spamCheck: {
            enable: false,
          },
        },
      };

      try {
        await sgMail.send(sendEmail);
        this.logger.log(`Mail sent successfully to ${recipient}`);
      } catch (error) {
        this.logger.error(`Cannot send email to ${recipient}`);
        this.logger.error(`Error: ${JSON.stringify(error)}`);
        throw new InternalServerErrorException(
          `Cannot send email to ${recipient}`,
        );
      }
    }
  }
}
