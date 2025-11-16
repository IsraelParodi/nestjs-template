import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { Quotations } from '@quotations/domain/quotations';
import { PaginationQueryQuotationsDto } from '@quotations/presenters/dto/pagination-query-quotations.dto';

export abstract class QuotationsRepository {
  abstract findById(id: number): Promise<Quotations | null>;
  abstract findAllPaginated(
    options: PaginationQueryQuotationsDto,
  ): Promise<PaginatedResult<Quotations>>;
  abstract save(user: Quotations, manager?): Promise<Quotations>;
  abstract update(repository: Quotations): Promise<Quotations>;
  abstract delete(id: number, deletedBy?: number): Promise<void>;
  abstract deleteMany(ids: number[], deletedBy?: number): Promise<void>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortOrder?: 'ASC' | 'DESC';
  filters?: FindQuotationsOptions;
}

export interface FindQuotationsOptions {
  name?: string;
  lastname?: string;
}
