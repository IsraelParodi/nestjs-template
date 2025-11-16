import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { Country } from '@localities/domain/entities/country';

export abstract class CountryRepository {
  abstract findById(id: number): Promise<Country | null>;
  abstract findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Country>>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}
