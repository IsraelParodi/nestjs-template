import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { State } from '@localities/domain/entities/state';

export abstract class StateRepository {
  abstract findByCountryAndStateId(
    countryId: number,
    stateId: number,
  ): Promise<State | null>;
  abstract findAllPaginated(
    countryId: number,
    options: PaginationOptions,
  ): Promise<PaginatedResult<State>>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}
