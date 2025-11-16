import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User } from '@users/domain/entities/user';
import { UserRepository } from '../ports/outbound/user.repository';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';
import { CountryRepository } from '@localities/application/ports/outbound/country.repository';
import { CreateUserUseCase } from '../ports/inbound/create-user.use-case';
import { EmailSender } from '@notifications/application/ports/outbound/email.sender';
import { SmsSender } from '@notifications/application/ports/outbound/sms.sender';
import { UserAlreadyExistsException } from '@users/domain/exceptions/user-already-exists.exception';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';
import { EmailTemplate } from '@notifications/domain/value-objects/email-template.vo';
import { CreateUserCommand } from '../commands/create-user.command';
import { Email } from '@users/domain/value-objects/email.vo';

@Injectable()
export class CreateUserService implements CreateUserUseCase {
  private readonly logger: Logger = new Logger(CreateUserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly hashingService: HashingService,
    private readonly countryRepository: CountryRepository,
    private readonly emailRepository: EmailSender,
    private readonly smsRepository: SmsSender,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    try {
      const [role, _, country] = await Promise.all([
        command.roleId && this.roleRepository.findById(command.roleId),
        command.createdBy && this.userRepository.findById(command.createdBy),
        command.countryId && this.countryRepository.findById(command.countryId),
      ]);

      this.logger.debug(`Role found: ${JSON.stringify(role)}`);
      this.logger.debug(`Country found: ${JSON.stringify(country)}`);

      const passwordHash = await this.hashingService.hash(command.password);
      const user = User.create({
        email: new Email(command.email),
        passwordHash,
        role,
        country,
        name: command.name,
        lastname: command.lastname,
        businessTaxId: command.businessTaxId,
        legalName: command.legalName,
        phone: command.phone,
      });

      const result = await this.userRepository.save(user);

      await Promise.all([
        this.emailRepository.send({
          channel: NotificationChannel.EMAIL,
          recipient: user.email.getValue(),
          subject: 'Melvan - Bienvenido a Melvan',
          templateId: EmailTemplate.WELCOME,
          message: {
            body: { password: command.password },
          },
        }),
        this.emailRepository.send({
          channel: NotificationChannel.EMAIL,
          recipient: user.email.getValue(),
          subject: 'Melvan - Nuevo usuario registrado',
          templateId: EmailTemplate.MELVAN_NEW_USER,
          message: {
            body: { email: user.email.getValue() },
          },
        }),
        this.smsRepository.send({
          channel: NotificationChannel.SMS,
          recipient: user.phone,
          message: 'Bienvenido, ahora es usuario!',
        }),
      ]);

      return this.userRepository.findById(result.id);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}
