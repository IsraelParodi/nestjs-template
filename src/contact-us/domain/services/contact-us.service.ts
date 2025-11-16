import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ContactUsRepository } from '../repositories/contact-us.repository';
import { ContactUs } from '../contact-us';
import { IFindOne } from '@common/interfaces/commons.interface';
import { UsersDomainService } from '@users/domain/services/users.service';
import { CountriesDomainService } from '@localities/domain/services/countries.service';
import { NotificationChannelEnum } from '@notifications/infrastructure/enums/notification-channel.enum';
import { NotificationEmailTemplateEnum } from '@notifications/infrastructure/enums/notification-email-templates.enum';
import { NotificationsApplicationService } from '@notifications/application/services/notifications.service';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryContactUsDto } from '@contact-us/presenters/dto/pagination-query-contact-us.dto';
import { ILike } from 'typeorm';

@Injectable()
export class ContactUsDomainService {
  private readonly logger = new Logger(ContactUsDomainService.name);

  constructor(
    private readonly contactUsRepository: ContactUsRepository,
    private readonly usersDomainService: UsersDomainService,
    private readonly countriesDomainService: CountriesDomainService,
    private readonly notificationsApplicationService: NotificationsApplicationService,
  ) {}

  async create(contactUs: ContactUs) {
    const { executor, countryFound } = await this.contactUsValidations(contactUs, true);
    this.logger.debug(`Creator found: ${JSON.stringify(executor)}`);

    contactUs.country = countryFound;

    const contactUsSaved = await this.contactUsRepository.save(contactUs);

    const { name, lastname, country, phone, email, message } = contactUs;

    await Promise.all([
      this.notificationsApplicationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: email,
        subject: 'Melvan - Solicitud de contacto',
        templateId: NotificationEmailTemplateEnum.USER_CONTACT_US,
        message: { body: { username: email } },
      }),
      this.notificationsApplicationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: process.env.NODE_ENV === 'PROD' ? 'melissapinday@melvanperu.com' : email,
        subject: 'Melvan - Solicitud de contacto',
        templateId: NotificationEmailTemplateEnum.MELVAN_CONTACT_US,
        message: {
          body: { name, lastname, country: country.name, phone, email, message },
        },
      }),
    ]);

    return contactUsSaved;
  }

  findAll({ start, limit, ...filters }: PaginationQueryContactUsDto) {
    const where: any = {};

    if (filters.name) where.name = ILike(`%${filters.name}%`);
    if (filters.lastname) where.lastname = ILike(`%${filters.lastname}%`);

    return this.contactUsRepository.find({ start, limit, where });
  }

  findOne({ where, relations, select }: IFindOne<ContactUs>) {
    return this.contactUsRepository.findOne({ where, relations, select });
  }

  remove(id: number, deletedBy: number) {
    return this.contactUsRepository.delete(id, deletedBy);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.contactUsRepository.deleteMany(deleteManyDto, deletedBy);
  }

  async contactUsValidations(dto: ContactUs, isCreate: boolean) {
    const { createdBy, country } = dto;
    let updatedBy;

    if ('updatedBy' in dto) {
      updatedBy = dto.updatedBy;
    }

    const whereCondition = isCreate ? createdBy.id : updatedBy;
    const whereUserExecutor = { id: whereCondition };
    const [executor, countryFound] = await Promise.all([
      whereCondition && this.usersDomainService.findOne({ where: whereUserExecutor }),
      country &&
        this.countriesDomainService.findOne({
          where: { id: country.id },
        }),
    ]);

    if (!executor && !isCreate) {
      const errorMessage = `No existe usuario con id: ${executor?.id}`;
      this.logger.debug(errorMessage);

      throw new BadRequestException(errorMessage);
    }

    return {
      executor,
      countryFound,
    };
  }
}
