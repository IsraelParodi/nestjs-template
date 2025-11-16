import { Injectable } from '@nestjs/common';
import { IFind, IFindOne } from '@common/interfaces/commons.interface';
import { StatesDomainService } from '@localities/domain/services/states.service';
import { State } from '@localities/domain/state';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';

@Injectable()
export class StatesApplicationService {
  constructor(private readonly statesDomainService: StatesDomainService) {}

  findAll(paginationQueryDto: PaginationQueryDto, { where, relations }: IFind) {
    return this.statesDomainService.findAll(paginationQueryDto, {
      where,
      relations,
    });
  }

  findOne({ where, relations, select }: IFindOne<State>) {
    return this.statesDomainService.findOne({ where, relations, select });
  }
}
