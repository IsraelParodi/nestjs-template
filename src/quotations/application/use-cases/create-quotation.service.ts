import { Injectable, Logger } from '@nestjs/common';
import { CreateQuotationsDto } from '@quotations/presenters/dto/create-quotations.dto';
import { EntityManager } from 'typeorm';
import { QuotationsRepository } from '../ports/outbound/quotations.repository';
import { Quotations } from '@quotations/domain/quotations';
import { CreateQuotationUseCase } from '../ports/inbound/create-quotation.use-case';
import { QuotationValidator } from '../validators/quotation.validator';

@Injectable()
export class CreateQuotationService implements CreateQuotationUseCase {
  private readonly logger = new Logger(CreateQuotationService.name);

  constructor(
    private readonly quotationsRepository: QuotationsRepository,
    private readonly quotationValidator: QuotationValidator,
  ) {}

  async execute(
    createQuotationsDto: CreateQuotationsDto,
    manager?: EntityManager,
  ) {
    const { executor, countryFound } = await this.quotationValidator.run({
      executorUserId: createQuotationsDto.createdBy,
      countryId: createQuotationsDto.country,
      userType: createQuotationsDto.userType,
      industryType: createQuotationsDto.industryType,
      transportType: createQuotationsDto.transportType,
      documentType: createQuotationsDto.documentType,
    });
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
}
