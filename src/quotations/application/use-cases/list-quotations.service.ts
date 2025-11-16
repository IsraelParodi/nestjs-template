import { Injectable, Logger } from '@nestjs/common';
import {
  PaginationOptions,
  QuotationsRepository,
} from '../ports/outbound/quotations.repository';
import { ListQuotationUseCase } from '../ports/inbound/list-quotations.use-case';
import { PaginationQueryQuotationsDto } from '@quotations/presenters/dto/pagination-query-quotations.dto';

@Injectable()
export class ListQuotationsService implements ListQuotationUseCase {
  private readonly logger = new Logger(ListQuotationsService.name);

  constructor(private readonly quotationsRepository: QuotationsRepository) {}

  async execute({ page, limit, ...filters }: PaginationQueryQuotationsDto) {
    const options: PaginationOptions = {
      page,
      limit,
      filters,
    };
    return this.quotationsRepository.findAllPaginated(options);
  }
}
