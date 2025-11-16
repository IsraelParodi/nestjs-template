import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';

import { ListOfValuesDetailDomainService } from '@lov/domain/services/lov-detail.service';
import { ListOfValuesDetail } from '@lov/domain/lov-detail';
import { UpdateListOfValuesDetailDto } from '@lov/presenters/dto/update-lov-detail.dto';
import { CreateListOfValuesDetailDto } from '@lov/presenters/dto/create-lov-detail.dto';

@Injectable()
export class ListOfValuesDetailApplicationService {
  constructor(private readonly listOfValuesDetailDomainService: ListOfValuesDetailDomainService) {}

  async create(createListOfValuesDto: CreateListOfValuesDetailDto, lovKey: string) {
    return await this.listOfValuesDetailDomainService.create(createListOfValuesDto, lovKey);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.listOfValuesDetailDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<ListOfValuesDetail>) {
    return this.listOfValuesDetailDomainService.findOne({
      where,
      relations,
      select,
    });
  }

  update(id: number, updateListOfValuesDto: UpdateListOfValuesDetailDto) {
    return this.listOfValuesDetailDomainService.update(id, updateListOfValuesDto);
  }

  remove(id: number) {
    return this.listOfValuesDetailDomainService.remove(id);
  }
}
