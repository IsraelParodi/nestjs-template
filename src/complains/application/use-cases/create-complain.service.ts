import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CountryRepository } from '@localities/application/ports/outbound/country.repository';
import { EmailSender } from '@notifications/application/ports/outbound/email.sender';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { Complains } from '@complains/domain/entities/complains';
import { CreateComplainUseCase } from '../ports/inbound/create-complain.use-case';
import { CreateComplainsDto } from '@complains/presenters/dto/create-complains.dto';
import { StateRepository } from '@localities/application/ports/outbound/state.repository';
import { ListOfValuesRepository } from '@lov/application/ports/outbound/lov.repository';
import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';
import { EmailTemplate } from '@notifications/domain/value-objects/email-template.vo';
import { ComplainsRepository } from '../ports/outbound/complains.repository';
import { ComplainsPrefixCode } from '@complains/infrastructure/enums/complains-prefix-code.enum';

@Injectable()
export class CreateComplainService implements CreateComplainUseCase {
  private readonly logger: Logger = new Logger(CreateComplainService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly countryRepository: CountryRepository,
    private readonly stateRepository: StateRepository,
    private readonly listOfValuesRepository: ListOfValuesRepository,
    private readonly complainsRepository: ComplainsRepository,
    private readonly emailRepository: EmailSender,
  ) {}

  async execute(createComplainsDto: CreateComplainsDto): Promise<Complains> {
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

    const [creator, country, state, documentType, serviceType, currency, type] =
      await Promise.all([
        userCreator && this.userRepository.findById(userCreator),
        complainerCountry && this.countryRepository.findById(complainerCountry),
        complainerState &&
          this.stateRepository.findByCountryAndStateId(
            complainerCountry,
            complainerState,
          ),
        documentTypeId &&
          this.listOfValuesRepository.findChildByKey(
            'document_type',
            documentTypeId,
          ),
        serviceTypeId &&
          this.listOfValuesRepository.findChildByKey(
            'service_type',
            serviceTypeId,
          ),
        currencyId &&
          this.listOfValuesRepository.findChildByKey('currency', currencyId),
        typeId &&
          this.listOfValuesRepository.findChildByKey('complaint_type', typeId),
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
      this.emailRepository.send({
        channel: NotificationChannel.EMAIL,
        recipient: complainsCreated.complainerEmail,
        subject: 'Melvan - Reclamo enviado',
        templateId: EmailTemplate.USER_COMPLAIN,
        message: { body: {} },
      }),
      this.emailRepository.send({
        channel: NotificationChannel.EMAIL,
        recipient: complainsCreated.complainerEmail,
        subject: 'Melvan - Nuevo reclamo',
        templateId: EmailTemplate.MELVAN_COMPLAIN,
        message: {
          body: {
            nationalTaxpayerRegistry: complainsCreated.nationalTaxpayerRegistry,
            companyName: complainsCreated.companyName,
            documentNumber: complainsCreated.documentNumber,
            name: complainsCreated.complainerName,
            address: complainsCreated.complainerAddress,
            state: complainsCreated.complainerState?.name,
            country: complainsCreated.complainerCountry?.name,
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

    return this.complainsRepository.findById(complainsCreated.id);
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
