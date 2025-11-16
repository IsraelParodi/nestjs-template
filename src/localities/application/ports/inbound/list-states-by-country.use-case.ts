import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { State } from '@localities/domain/entities/state';

export abstract class ListStatesByCountryUseCase {
  abstract execute(
    countryId: number,
    { page, limit }: PaginationQueryDto,
  ): Promise<PaginatedResult<State>>;
}
