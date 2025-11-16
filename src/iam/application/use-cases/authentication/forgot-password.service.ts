import { Injectable, Logger } from '@nestjs/common';
import { ResetPasswordRepository } from '../../ports/outbound/reset-password.repository';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';
import { BO_URL } from '@common/infrastructure/constants/common.constants';
import * as crypto from 'node:crypto';
import { ForgotPasswordDto } from '@iam/presenters/dto/iam/forgot-password.dto';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { EmailSender } from '@notifications/application/ports/outbound/email.sender';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';
import { EmailTemplate } from '@notifications/domain/value-objects/email-template.vo';
import { ForgotPasswordUseCase } from '@iam/application/ports/inbound/authentication/forgot-password.use-case';

@Injectable()
export class ForgotPasswordService implements ForgotPasswordUseCase {
  private readonly logger: Logger = new Logger(ForgotPasswordService.name);

  constructor(
    private readonly resetPasswordRepositoryPort: ResetPasswordRepository,
    private readonly emailRepository: EmailSender,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ email }: ForgotPasswordDto) {
    try {
      await this.userRepository.getByEmail(email);

      const tokenFound =
        await this.resetPasswordRepositoryPort.findByEmail(email);
      const token = crypto.randomBytes(32).toString('hex');
      const resetLink = `${BO_URL()[process.env.APP_ENV]}/auth/reset-password?token=${token}`;

      if (tokenFound) {
        tokenFound.token = token;
        await this.resetPasswordRepositoryPort.save(tokenFound);
      } else {
        await this.resetPasswordRepositoryPort.save({ email, token });
      }

      const paramsNotificationEmailSend: SendNotificationType = {
        channel: NotificationChannel.EMAIL,
        recipient: email,
        subject: 'Melvan - Solicitud de cambio de contraseña',
        templateId: EmailTemplate.USER_FORGOT_PASSWORD,
        message: { body: { changePasswordUrl: resetLink } },
      };

      await this.emailRepository.send(paramsNotificationEmailSend);
      if (['DEV', 'TEST'].includes(process.env.APP_ENV)) {
        return { token };
      }
    } catch (error) {
      this.logger.error('Error:', JSON.stringify(error));
      throw error;
    }
  }
}
