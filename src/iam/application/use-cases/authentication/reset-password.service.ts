import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ResetPasswordRepository } from '../../ports/outbound/reset-password.repository';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';
import { ResetPasswordDto } from '@iam/presenters/dto/iam/reset-password.dto';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { User } from '@users/domain/entities/user';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';
import { EmailSender } from '@notifications/application/ports/outbound/email.sender';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';
import { EmailTemplate } from '@notifications/domain/value-objects/email-template.vo';
import { ResetPasswordUseCase } from '@iam/application/ports/inbound/authentication/reset-password.use-case';

@Injectable()
export class ResetPasswordService implements ResetPasswordUseCase {
  private readonly logger: Logger = new Logger(ResetPasswordService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly resetPasswordRepositoryPort: ResetPasswordRepository,
    private readonly emailRepository: EmailSender,
    private readonly hashingService: HashingService,
  ) {}

  async execute({ token, password }: ResetPasswordDto) {
    const resetToken =
      await this.resetPasswordRepositoryPort.findByToken(token);
    if (!resetToken) throw new BadRequestException('Invalid or expired token');

    const user = await this.userRepository.findByEmail(resetToken.email);
    const newPasswordHash = await this.hashingService.hash(password);

    const updatedUser = User.restore({
      id: user.id,
      email: user.email,
      passwordHash: newPasswordHash,
      role: user.role,
      name: user.name,
      lastname: user.lastname,
      businessTaxId: user.businessTaxId,
      legalName: user.legalName,
      country: user.country,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: new Date(),
      deletedAt: user.deletedAt,
    });

    await this.userRepository.save(updatedUser);
    await this.resetPasswordRepositoryPort.delete(resetToken.token);

    const paramsNotificationEmailSend: SendNotificationType = {
      channel: NotificationChannel.EMAIL,
      recipient: resetToken.email,
      subject: 'Melvan - Datos de acceso actualizados',
      templateId: EmailTemplate.USER_ACCESS_CHANGE,
      message: { body: {} },
    };

    await this.emailRepository.send(paramsNotificationEmailSend);
  }
}
