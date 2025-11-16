import { Injectable, Logger } from '@nestjs/common';
import { QuotationsRepository } from '../ports/outbound/quotations.repository';
import { DeleteManyContactUsUseCase } from '@contact-us/application/ports/inbound/delete-many-contact-us.use-case';

@Injectable()
export class DeleteManyQuotationService implements DeleteManyContactUsUseCase {
  private readonly logger = new Logger(DeleteManyQuotationService.name);

  constructor(private readonly quotationsRepository: QuotationsRepository) {}

  async execute(ids: number[], deletedBy: number) {
    return this.quotationsRepository.deleteMany(ids, deletedBy);
  }
}
