import { Injectable, Logger } from '@nestjs/common';
import { QuotationsRepository } from '../ports/outbound/quotations.repository';
import { DeleteQuotationUseCase } from '../ports/inbound/delete-quotation.use-case';

@Injectable()
export class DeleteQuotationService implements DeleteQuotationUseCase {
  private readonly logger = new Logger(DeleteQuotationService.name);

  constructor(private readonly quotationsRepository: QuotationsRepository) {}

  async execute(id: number) {
    return this.quotationsRepository.delete(id);
  }
}
