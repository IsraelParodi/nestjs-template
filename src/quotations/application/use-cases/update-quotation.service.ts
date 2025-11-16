import { Injectable, Logger } from '@nestjs/common';
import { QuotationsRepository } from '../ports/outbound/quotations.repository';
import { UpdateQuotationUseCase } from '../ports/inbound/update-quotation.use-case';
import { UpdateQuotationsDto } from '@quotations/presenters/dto/update-quotations.dto';
import { QuotationValidator } from '../validators/quotation.validator';

@Injectable()
export class UpdateQuotationsService implements UpdateQuotationUseCase {
  private readonly logger = new Logger(UpdateQuotationsService.name);

  constructor(
    private readonly quotationsRepository: QuotationsRepository,
    private readonly quotationValidator: QuotationValidator,
  ) {}

  async execute(id: number, updateQuotationsDto: UpdateQuotationsDto) {
    const quotations = await this.quotationsRepository.findById(id);

    const { executor, countryFound } = await this.quotationValidator.run({
      executorUserId: updateQuotationsDto.updatedBy,
      countryId: updateQuotationsDto.country,
      userType: updateQuotationsDto.userType,
      industryType: updateQuotationsDto.industryType,
      transportType: updateQuotationsDto.transportType,
      documentType: updateQuotationsDto.documentType,
    });

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
}
