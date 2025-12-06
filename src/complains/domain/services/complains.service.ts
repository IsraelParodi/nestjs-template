import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ComplainsRepository } from '../repositories/complains.repository';
import { Complains } from '../complains';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';
import { CreateComplainsDto } from '@complains/presenters/dto/create-complains.dto';
import { UsersDomainService } from '@users/domain/services/users.service';
import { ComplainsPrefixCode } from '@complains/infrastructure/enums/complains-prefix-code.enum';
import { UpdateComplainsDto } from '@complains/presenters/dto/update-complains.dto';
import { CountriesDomainService } from '@localities/domain/services/countries.service';
import { StatesDomainService } from '@localities/domain/services/states.service';
import { ListOfValuesDomainService } from '@lov/domain/services/lov.service';
import { NotificationChannelEnum } from '@notifications/infrastructure/enums/notification-channel.enum';
import { NotificationEmailTemplateEnum } from '@notifications/infrastructure/enums/notification-email-templates.enum';
import { NotificationsDomainService } from '@notifications/domain/services/notifications.service';

@Injectable()
export class ComplainsDomainService {
  private readonly logger = new Logger(ComplainsDomainService.name);

  constructor(
    private readonly complainsRepository: ComplainsRepository,
    private readonly usersDomainService: UsersDomainService,
    private readonly listOfValuesDomainService: ListOfValuesDomainService,
    private readonly countriesDomainService: CountriesDomainService,
    private readonly statesDomainService: StatesDomainService,
    private readonly notificationService: NotificationsDomainService,
  ) {}

  async create(createComplainsDto: CreateComplainsDto) {
    const {
      documentNumber,
      complainerState,
      complainerCountry,
      type: typeId,
      currency: currencyId,
      createdBy: userCreator,
      serviceType: serviceTypeId,
      documentType: documentTypeId,
    } = createComplainsDto;
    const whereUserCreator = { id: userCreator };

    const [creator, country, state, documentType, serviceType, currency, type] =
      await Promise.all([
        userCreator &&
          this.usersDomainService.findOne({ where: whereUserCreator }),
        complainerCountry &&
          this.countriesDomainService.findOne({
            where: { id: complainerCountry },
          }),
        complainerState &&
          this.statesDomainService.findOne({ where: { id: complainerState } }),
        documentTypeId &&
          this.listOfValuesDomainService.findChildByKey(
            'document_type',
            documentTypeId,
          ),
        serviceTypeId &&
          this.listOfValuesDomainService.findChildByKey(
            'service_type',
            serviceTypeId,
          ),
        currencyId &&
          this.listOfValuesDomainService.findChildByKey('currency', currencyId),
        typeId &&
          this.listOfValuesDomainService.findChildByKey(
            'complaint_type',
            typeId,
          ),
      ]);

    this.logger.debug(`Creator found: ${JSON.stringify(creator)}`);

    this.validateDocumentNumber(documentType.name, documentNumber);

    const complains = new Complains();

    Object.assign(complains, createComplainsDto);
    complains.complainerState = state;
    complains.complainerCountry = country;
    complains.documentType = documentType.name;
    complains.serviceType = serviceType.name;
    complains.currency = currency.name;
    complains.type = type.detail;

    const complainsSaved = await this.complainsRepository.save(complains);

    const complaisCodeaux = complainsSaved.id.toString().padStart(8, '0');
    const complainsCode = `${ComplainsPrefixCode.BOOK}-${complaisCodeaux}`;

    complainsSaved.code = complainsCode;

    const complainsCreated =
      await this.complainsRepository.update(complainsSaved);

    await Promise.all([
      this.notificationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: complainsCreated.complainerEmail,
        subject: 'Melvan - Reclamo enviado',
        templateId: NotificationEmailTemplateEnum.USER_COMPLAIN,
        message: { body: {} },
      }),
      this.notificationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: complainsCreated.complainerEmail,
        subject: 'Melvan - Nuevo reclamo',
        templateId: NotificationEmailTemplateEnum.MELVAN_COMPLAIN,
        message: {
          body: {
            nationalTaxpayerRegistry: complainsCreated.nationalTaxpayerRegistry,
            companyName: complainsCreated.companyName,
            documentNumber: complainsCreated.documentNumber,
            name: complainsCreated.complainerName,
            address: complainsCreated.complainerAddress,
            state: complainsCreated.complainerState.name,
            country: complainsCreated.complainerCountry.name,
            phone: complainsCreated.complainerPhone,
            email: complainsCreated.complainerEmail,
            serviceType: complainsCreated.serviceType,
            amount: complainsCreated.amountComplained,
            description: complainsCreated.description,
            complainType: complainsCreated.type,
            detail: complainsCreated.detail,
            request: complainsCreated.request,
          },
        },
      }),
    ]);

    return this.findOne({ where: { id: complainsCreated.id } });
  }

  findAll({ start, limit }: PaginationQueryDto) {
    return this.complainsRepository.find({ start, limit });
  }

  findOne({ where, relations, select }: IFindOne<Complains>) {
    return this.complainsRepository.findOne({ where, relations, select });
  }

  async update(id: number, updateComplainsDto: UpdateComplainsDto) {
    const complains = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    const { updatedBy: userUpdater } = updateComplainsDto;
    const whereUserCreator = { id: userUpdater };

    const updater = await this.usersDomainService.findOne({
      where: whereUserCreator,
    });

    this.logger.debug(`Updater found: ${JSON.stringify(updater)}`);

    Object.assign(complains, updateComplainsDto);
    complains.updatedBy = updater;
    return this.complainsRepository.update(complains);
  }

  remove(id: number) {
    return this.complainsRepository.delete(id);
  }

  private validateDocumentNumber(
    documentType: string,
    documentNumber: string,
  ): void {
    const patterns: Record<string, RegExp> = {
      DNI: /^\d{8}$/,
      RUC: /^(10|20)\d{9}$/,
      CE: /^\d{20}$/,
    };

    const expectedLengths: Record<string, number> = {
      DNI: 8,
      RUC: 11,
      CE: 20,
    };

    const regex = patterns[documentType];
    const expectedLength = expectedLengths[documentType];

    if (!regex.test(documentNumber)) {
      throw new BadRequestException(
        `documentNumber must contain only numbers and have ${expectedLength} digits for documentType "${documentType}".`,
      );
    }
  }
}
