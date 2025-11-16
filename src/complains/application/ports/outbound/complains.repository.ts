import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { Complains } from '@complains/domain/entities/complains';

export abstract class ComplainsRepository {
  abstract findById(id: number): Promise<Complains | null>;
  abstract findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Complains>>;
  abstract save(user: Complains): Promise<Complains>;
  abstract delete(id: number): Promise<void>;
  abstract update(repository: Complains): Promise<Complains>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortOrder?: 'ASC' | 'DESC';
}
