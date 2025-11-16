import { Injectable } from '@nestjs/common';
import { UpdateUserUseCase } from '../ports/inbound/update-user.use-case';
import { UserRepository } from '../ports/outbound/user.repository';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';
import { CountryRepository } from '@localities/application/ports/outbound/country.repository';
import { EmailSender } from '@notifications/application/ports/outbound/email.sender';

import { UpdateUserCommand } from '../commands/update-user.command';
import { User } from '@users/domain/entities/user';
import { Email } from '@users/domain/value-objects/email.vo';
import { EmailTemplate } from '@notifications/domain/value-objects/email-template.vo';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';

@Injectable()
export class UpdateUserService implements UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly countryRepository: CountryRepository,
    private readonly hashingService: HashingService,
    private readonly emailSender: EmailSender,
  ) {}

  async execute(id: number, command: UpdateUserCommand): Promise<User> {
    const existing = await this.userRepository.getById(id);

    const [role, country] = await Promise.all([
      command.roleId
        ? this.roleRepository.findById(command.roleId)
        : Promise.resolve(existing.role),

      command.countryId
        ? this.countryRepository.findById(command.countryId)
        : Promise.resolve(existing.country),
    ]);

    const passwordHash = command.password
      ? await this.hashingService.hash(command.password)
      : (existing as any).passwordHash;

    const updatedUser = User.restore({
      id: existing.id,
      email: command.email ? new Email(command.email) : existing.email,
      passwordHash,
      role,
      country,
      name: command.name ?? existing.name,
      lastname: command.lastname ?? existing.lastname,
      businessTaxId: command.businessTaxId ?? existing.businessTaxId,
      legalName: command.legalName ?? existing.legalName,
      phone: command.phone ?? existing.phone,
      address: command.address ?? existing.address,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    const saved = await this.userRepository.save(updatedUser);

    if (command.email || command.password) {
      const paramsNotificationEmailSend: SendNotificationType = {
        channel: NotificationChannel.EMAIL,
        recipient: saved.email.getValue(),
        subject: 'Melvan - Datos de acceso actualizados',
        templateId: EmailTemplate.USER_ACCESS_CHANGE,
        message: { body: {} },
      };

      await this.emailSender.send(paramsNotificationEmailSend);
    }

    return saved;
  }
}
