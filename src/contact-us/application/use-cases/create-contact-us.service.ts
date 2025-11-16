import { Injectable, Logger } from '@nestjs/common';
import { CountryRepository } from '@localities/application/ports/outbound/country.repository';
import { EmailSender } from '@notifications/application/ports/outbound/email.sender';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';
import { EmailTemplate } from '@notifications/domain/value-objects/email-template.vo';
import { CreateContactUsUseCase } from '../ports/inbound/create-contact-us.use-case';
import { ContactUs } from '@contact-us/domain/contact-us';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { ContactUsRepository } from '../ports/outbound/contact-us.repository';

@Injectable()
export class CreateContactUsService implements CreateContactUsUseCase {
  private readonly logger: Logger = new Logger(CreateContactUsService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly contactUsRepository: ContactUsRepository,
    private readonly countryRepository: CountryRepository,
    private readonly emailRepository: EmailSender,
  ) {}

  async execute(contactUs: ContactUs): Promise<ContactUs> {
    const { executor, countryFound } =
      await this.contactUsValidations(contactUs);
    this.logger.debug(`Creator found: ${JSON.stringify(executor)}`);

    contactUs.country = countryFound;

    const contactUsSaved = await this.contactUsRepository.save(contactUs);

    const { name, lastname, country, phone, email, message } = contactUs;

    await Promise.all([
      this.emailRepository.send({
        channel: NotificationChannel.EMAIL,
        recipient: email,
        subject: 'Melvan - Solicitud de contacto',
        templateId: EmailTemplate.USER_CONTACT_US,
        message: { body: { username: email } },
      }),
      this.emailRepository.send({
        channel: NotificationChannel.EMAIL,
        recipient: email,
        subject: 'Melvan - Solicitud de contacto',
        templateId: EmailTemplate.MELVAN_CONTACT_US,
        message: {
          body: {
            name,
            lastname,
            country: country.name,
            phone,
            email,
            message,
          },
        },
      }),
    ]);

    return contactUsSaved;
  }

  private async contactUsValidations(dto: ContactUs) {
    const { createdBy, country } = dto;

    const [executor, countryFound] = await Promise.all([
      createdBy?.id && this.userRepository.findById(createdBy.id),
      country.id && this.countryRepository.findById(country.id),
    ]);

    return {
      executor,
      countryFound,
    };
  }
}
