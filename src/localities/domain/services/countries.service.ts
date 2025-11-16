import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';
import { Country } from '../country';
import { CountryRepository } from '../repositories/country.repository';

@Injectable()
export class CountriesDomainService {
  private readonly logger = new Logger(CountriesDomainService.name);

  constructor(private readonly countryRepository: CountryRepository) {}

  findAll({ start, limit }: PaginationQueryDto) {
    return this.countryRepository.find({ start, limit });
  }

  findOne({ where, relations, select }: IFindOne<Country>) {
    return this.countryRepository.findOne({ where, relations, select });
  }
}
