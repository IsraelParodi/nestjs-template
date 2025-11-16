import { Inject, Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import sengridConfig from '@notifications/infrastructure/config/sengrid.config';
import { ConfigType } from '@nestjs/config';
import { SendEmailType } from '@notifications/infrastructure/types/send-email.type';
import { EmailProvider } from './email.provider';

@Injectable()
export class SendgridProvider implements EmailProvider {
  private readonly logger = new Logger(SendgridProvider.name);

  constructor(
    @Inject(sengridConfig.KEY)
    private readonly sendgridConfiguration: ConfigType<typeof sengridConfig>,
  ) {
    sgMail.setApiKey(sendgridConfiguration.apiKey);
  }

  async send(params: SendEmailType) {
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
      throw error;
    }
  }
}
