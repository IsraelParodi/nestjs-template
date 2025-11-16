import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { Country } from '@localities/domain/entities/country';

export abstract class ListCountriesUseCase {
  abstract execute({
    page,
    limit,
  }: PaginationQueryDto): Promise<PaginatedResult<Country>>;
}
