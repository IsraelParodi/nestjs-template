import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';
import { Country } from '@localities/domain/country';
import { CountriesDomainService } from '@localities/domain/services/countries.service';

@Injectable()
export class CountriesApplicationService {
  constructor(private readonly countriesDomainService: CountriesDomainService) {}

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.countriesDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<Country>) {
    return this.countriesDomainService.findOne({ where, relations, select });
  }
}
