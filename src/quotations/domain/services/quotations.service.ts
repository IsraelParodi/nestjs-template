import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { QuotationsRepository } from '../repositories/quotations.repository';
import { Quotations } from '../quotations';
import { IFindOne } from '@common/interfaces/commons.interface';
import { CreateQuotationsDto } from '@quotations/presenters/dto/create-quotations.dto';
import { UsersDomainService } from '@users/domain/services/users.service';
import { UpdateQuotationsDto } from '@quotations/presenters/dto/update-quotations.dto';
import { CountriesDomainService } from '@localities/domain/services/countries.service';
import { ListOfValuesDomainService } from '@lov/domain/services/lov.service';
import { NotificationChannelEnum } from '@notifications/infrastructure/enums/notification-channel.enum';
import { NotificationEmailTemplateEnum } from '@notifications/infrastructure/enums/notification-email-templates.enum';
import { NotificationsApplicationService } from '@notifications/application/services/notifications.service';
import { SeaPortsDomainService } from '@sea-ports/domain/services/sea-ports.service';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryQuotationsDto } from '@quotations/presenters/dto/pagination-query-quotations.dto';
import { ILike } from 'typeorm';

@Injectable()
export class QuotationsDomainService {
  private readonly logger = new Logger(QuotationsDomainService.name);

  constructor(
    private readonly quotationsRepository: QuotationsRepository,
    private readonly usersDomainService: UsersDomainService,
    private readonly listOfValuesDomainService: ListOfValuesDomainService,
    private readonly countriesDomainService: CountriesDomainService,
    private readonly notificationsApplicationService: NotificationsApplicationService,
    private readonly seaPortsDomainService: SeaPortsDomainService,
  ) {}

  async create(createQuotationsDto: CreateQuotationsDto) {
    const { executor, countryFound } = await this.quotationsValidations(createQuotationsDto, true);
    this.logger.debug(`Creator found: ${JSON.stringify(executor)}`);

    const quotations = new Quotations();

    Object.assign(quotations, createQuotationsDto);
    quotations.country = countryFound;

    console.log('before saving - quotations: ', quotations);

    const quotationsSaved = await this.quotationsRepository.save(quotations);

    const {
      name,
      lastname,
      userType,
      country,
      documentNumber,
      phone,
      email,
      transportType,
      shippingType,
      cargoVolume,
      industryType,
      origin,
      destination,
    } = quotationsSaved;

    await Promise.all([
      this.notificationsApplicationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: quotations.email,
        subject: 'Melvan - Solicitud de cotización',
        templateId: NotificationEmailTemplateEnum.USER_QUOTATION,
        message: {
          body: {
            transportType,
            shippingType,
            origin,
            destination,
          },
        },
      }),
      this.notificationsApplicationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: process.env.NODE_ENV === 'PROD' ? 'melissapinday@melvanperu.com' : quotations.email,
        subject: 'Melvan - Solicitud de cotización',
        templateId: NotificationEmailTemplateEnum.MELVAN_QUOTATION,
        message: {
          body: {
            name,
            lastname,
            userType,
            country: country.name,
            documentNumber,
            phone,
            email,
            transportType,
            shippingType,
            cargoVolume,
            industryType,
            origin,
            destination,
          },
        },
      }),
    ]);

    return quotationsSaved;
  }

  findAll({ start, limit, ...filters }: PaginationQueryQuotationsDto) {
    const where: any = {};

    if (filters.name) where.name = ILike(`%${filters.name}%`);
    if (filters.lastname) where.lastname = ILike(`%${filters.lastname}%`);

    return this.quotationsRepository.find({ start, limit, where });
  }

  findOne({ where, relations, select }: IFindOne<Quotations>) {
    return this.quotationsRepository.findOne({ where, relations, select });
  }

  async update(id: number, updateQuotationsDto: UpdateQuotationsDto) {
    const quotations = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'country'],
    });

    const { executor, countryFound } = await this.quotationsValidations(updateQuotationsDto, false);

    this.logger.debug(`Updater found: ${JSON.stringify(executor)}`);

    Object.assign(quotations, updateQuotationsDto);
    quotations.updatedBy = executor;
    if (countryFound) {
      quotations.country = countryFound;
    }

    if (updateQuotationsDto.transportType !== 'Transporte marítimo' && quotations.shippingType) {
      quotations.shippingType = null;
    }

    return this.quotationsRepository.update(quotations);
  }

  remove(id: number) {
    return this.quotationsRepository.delete(id);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.quotationsRepository.deleteMany(deleteManyDto, deletedBy);
  }

  async quotationsValidations(dto: CreateQuotationsDto | UpdateQuotationsDto, isCreate: boolean) {
    const {
      createdBy,
      country,
      userType,
      industryType,
      transportType,
      documentType,
      origin,
      destination,
      shippingType,
      containerCode,
    } = dto;
    let updatedBy;

    if ('updatedBy' in dto) {
      updatedBy = dto.updatedBy;
    }
    const whereCondition = isCreate ? createdBy : updatedBy;
    const whereUserExecutor = { id: whereCondition };
    const [
      executor,
      countryFound,
      userTypeFound,
      documentTypeFound,
      industryTypeFound,
      transportTypeFound,
      originFound,
      destinationFound,
    ] = await Promise.all([
      whereCondition && this.usersDomainService.findOne({ where: whereUserExecutor }),
      country &&
        this.countriesDomainService.findOne({
          where: { id: country },
        }),
      userType && this.listOfValuesDomainService.findChildByName('user_type', userType),
      documentType && this.listOfValuesDomainService.findChildByName('document_type', documentType),
      industryType && this.listOfValuesDomainService.findChildByName('industry_type', industryType),
      transportType && this.listOfValuesDomainService.findChildByName('transport_type', transportType),
      shippingType && this.listOfValuesDomainService.findChildByName('shipping_type', shippingType),
      containerCode && this.listOfValuesDomainService.findChildByName('containers_size', containerCode),
      origin &&
        this.seaPortsDomainService.findOne({
          where: {
            iso2Country: origin.substring(0, 2),
            location: origin.slice(-3),
          },
        }),
      destination &&
        this.seaPortsDomainService.findOne({
          where: {
            iso2Country: destination.substring(0, 2),
            location: destination.slice(-3),
          },
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
      userTypeFound,
      documentTypeFound,
      industryTypeFound,
      transportTypeFound,
      originFound,
      destinationFound,
    };
  }
}
