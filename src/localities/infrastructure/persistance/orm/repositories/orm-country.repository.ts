import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';
import { CountryRepository } from '@localities/domain/repositories/country.repository';
import { Country } from '@localities/domain/country';
import { CountryEntity } from '../entities/country.entity';
import { CountryMapper } from '../mappers/country.mapper';
import { PageableService } from '@common/services/pageable.service';

@Injectable()
export class OrmCountryRepository implements CountryRepository {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async findOne({
    where,
    relations,
    select,
  }: IFindOne<Country>): Promise<Country> {
    const entity = await this.countryRepository.findOne({
      where,
      relations,
      select,
    });

    if (!entity) {
      throw new NotFoundException(`Country with ID ${where.id} not found`);
    }

    return CountryMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<Country>> {
    const [countries, total] = await this.countryRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
      order: {
        id: 'ASC',
      },
    });

    const data = countries.map((role) => CountryMapper.toDomain(role));

    return this.pageableService.getPages({ data, total, start, limit });
  }
}
