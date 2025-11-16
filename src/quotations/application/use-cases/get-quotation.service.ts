import { Injectable, Logger } from '@nestjs/common';
import { QuotationsRepository } from '../ports/outbound/quotations.repository';
import { GetQuotationUseCase } from '../ports/inbound/get-quotation.use-case';

@Injectable()
export class GetQuotationService implements GetQuotationUseCase {
  private readonly logger = new Logger(GetQuotationService.name);

  constructor(private readonly quotationsRepository: QuotationsRepository) {}

  async execute(id: number) {
    return this.quotationsRepository.findById(id);
  }
}
