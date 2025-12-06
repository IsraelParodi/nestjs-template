import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';

import { ListOfValuesDomainService } from '@lov/domain/services/lov.service';
import { ListOfValues } from '@lov/domain/lov';
import { UpdateListOfValuesDto } from '@lov/presenters/dto/update-lov.dto';
import { CreateListOfValuesDto } from '@lov/presenters/dto/create-lov.dto';
import { ListOfValuesMapper } from '@lov/infrastructure/persistance/orm/mappers/lov.mapper';

@Injectable()
export class ListOfValuesApplicationService {
  constructor(
    private readonly listOfValuesDomainService: ListOfValuesDomainService,
  ) { }

  async create(createListOfValuesDto: CreateListOfValuesDto) {
    const createListOfValues = ListOfValuesMapper.fromDtotoDomain(createListOfValuesDto);
    return await this.listOfValuesDomainService.create(createListOfValues);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.listOfValuesDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<ListOfValues>) {
    return this.listOfValuesDomainService.findOne({
      where,
      relations,
      select,
      validate: true
    });
  }

  update(id: number, updateListOfValuesDto: UpdateListOfValuesDto) {
    return this.listOfValuesDomainService.update(id, updateListOfValuesDto);
  }

  remove(id: number) {
    return this.listOfValuesDomainService.remove(id);
  }
}
