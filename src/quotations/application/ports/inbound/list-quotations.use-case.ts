import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { Quotations } from '@quotations/domain/quotations';
import { PaginationQueryQuotationsDto } from '@quotations/presenters/dto/pagination-query-quotations.dto';

export abstract class ListQuotationUseCase {
  abstract execute(
    paginationQueryDto: PaginationQueryQuotationsDto,
  ): Promise<PaginatedResult<Quotations>>;
}
