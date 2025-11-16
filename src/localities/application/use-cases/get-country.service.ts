import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Country } from '@localities/domain/entities/country';
import { CountryRepository } from '../ports/outbound/country.repository';

@Injectable()
export class GetCountryService {
  private readonly logger: Logger = new Logger(GetCountryService.name);

  constructor(private readonly countryRepositoryPort: CountryRepository) {}

  async execute(id: number): Promise<Country> {
    const country = await this.countryRepositoryPort.findById(id);

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }
}
