import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { State } from '@localities/domain/entities/state';
import { StateRepository } from '../ports/outbound/state.repository';

@Injectable()
export class ListStatesByCountryService {
  private readonly logger: Logger = new Logger(ListStatesByCountryService.name);

  constructor(private readonly stateRepositoryPort: StateRepository) {}

  async execute(
    countryId: number,
    { page, limit }: PaginationQueryDto,
  ): Promise<PaginatedResult<State>> {
    const states = await this.stateRepositoryPort.findAllPaginated(countryId, {
      page,
      limit,
    });

    return states;
  }
}
