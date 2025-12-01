import { Injectable, Logger } from '@nestjs/common';
import { QuotationsRepository } from '../repositories/quotations.repository';
import { Quotations } from '../quotations';
import { IFindOne } from '@common/interfaces/commons.interface';
import { CreateQuotationsDto } from '@quotations/presenters/dto/create-quotations.dto';
import { UsersDomainService } from '@users/domain/services/users.service';
import { UpdateQuotationsDto } from '@quotations/presenters/dto/update-quotations.dto';
import { CountriesDomainService } from '@localities/domain/services/countries.service';
import { ListOfValuesDomainService } from '@lov/domain/services/lov.service';
import { NotificationsApplicationService } from '@notifications/application/services/notifications.service';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryQuotationsDto } from '@quotations/presenters/dto/pagination-query-quotations.dto';
import { EntityManager, ILike } from 'typeorm';

@Injectable()
export class QuotationsDomainService {
  private readonly logger = new Logger(QuotationsDomainService.name);

  constructor(
    private readonly quotationsRepository: QuotationsRepository,
    private readonly usersDomainService: UsersDomainService,
    private readonly listOfValuesDomainService: ListOfValuesDomainService,
    private readonly countriesDomainService: CountriesDomainService,
    private readonly notificationsApplicationService: NotificationsApplicationService,
  ) {}

  async create(
    createQuotationsDto: CreateQuotationsDto,
    manager?: EntityManager,
  ) {
    const { executor, countryFound } = await this.quotationsValidations(
      createQuotationsDto,
      true,
    );
    this.logger.debug(`Creator found: ${JSON.stringify(executor)}`);

    const quotations = new Quotations();

    Object.assign(quotations, createQuotationsDto);
    quotations.country = countryFound;

    const quotationsSaved = await this.quotationsRepository.save(
      quotations,
      manager,
    );

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

    const { executor, countryFound } = await this.quotationsValidations(
      updateQuotationsDto,
      false,
    );

    this.logger.debug(`Updater found: ${JSON.stringify(executor)}`);

    Object.assign(quotations, updateQuotationsDto);
    quotations.updatedBy = executor;
    if (countryFound) {
      quotations.country = countryFound;
    }

    if (
      updateQuotationsDto.transportType !== 'Transporte marítimo' &&
      quotations.shippingType
    ) {
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

  async quotationsValidations(
    dto: CreateQuotationsDto | UpdateQuotationsDto,
    isCreate: boolean,
  ) {
    const {
      createdBy,
      country,
      userType,
      industryType,
      transportType,
      documentType,
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
    ] = await Promise.all([
      whereCondition &&
        this.usersDomainService.findOne({ where: whereUserExecutor }),
      country &&
        this.countriesDomainService.findOne({
          where: { id: country },
        }),
      userType &&
        this.listOfValuesDomainService.findChildByName('user_type', userType),
      documentType &&
        this.listOfValuesDomainService.findChildByName(
          'document_type',
          documentType,
        ),
      industryType &&
        this.listOfValuesDomainService.findChildByName(
          'industry_type',
          industryType,
        ),
      transportType &&
        this.listOfValuesDomainService.findChildByName(
          'transport_type',
          transportType,
        ),
    ]);

    return {
      executor,
      countryFound,
      userTypeFound,
      documentTypeFound,
      industryTypeFound,
      transportTypeFound,
    };
  }
}
