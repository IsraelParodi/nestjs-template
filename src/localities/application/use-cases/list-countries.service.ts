import { Injectable, Logger } from '@nestjs/common';
import { Country } from '@localities/domain/entities/country';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ListCountriesUseCase } from '../ports/inbound/list-countries.use-case';
import { CountryRepository } from '../ports/outbound/country.repository';

@Injectable()
export class ListCountriesService implements ListCountriesUseCase {
  private readonly logger: Logger = new Logger(ListCountriesUseCase.name);

  constructor(private readonly countryRepositoryPort: CountryRepository) {}

  async execute({
    page,
    limit,
  }: PaginationQueryDto): Promise<PaginatedResult<Country>> {
    const countries = await this.countryRepositoryPort.findAllPaginated({
      page,
      limit,
    });

    return countries;
  }
}
