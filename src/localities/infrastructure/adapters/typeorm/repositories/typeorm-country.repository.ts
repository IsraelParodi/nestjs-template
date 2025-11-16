import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import {
  CountryRepository,
  PaginationOptions,
} from '@localities/application/ports/outbound/country.repository';
import { Country } from '@localities/domain/entities/country';
import { CountryEntity } from '../entities/country.entity';
import { CountryMapper } from '../mappers/country.mapper';
import { PageableService } from '@common/services/pageable.service';

@Injectable()
export class TypeOrmCountryRepository implements CountryRepository {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async findById(id: number): Promise<Country> {
    const entity = await this.countryRepository.findOne({
      where: { id },
    });

    return entity ? CountryMapper.toDomain(entity) : null;
  }

  async findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Country>> {
    const [countries, total] = await this.countryRepository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'ASC' },
    });

    const data = countries.map((entity) => CountryMapper.toDomain(entity));

    return this.pageableService.getPages({
      data,
      total,
      page: options.page,
      limit: options.limit,
    });
  }
}
