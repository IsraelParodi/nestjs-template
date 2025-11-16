import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFind, IFindOne } from '@common/interfaces/commons.interface';
import { Country } from '../country';
import { StateRepository } from '../repositories/state.repository';

@Injectable()
export class StatesDomainService {
  private readonly logger = new Logger(StatesDomainService.name);

  constructor(private readonly stateRepository: StateRepository) {}

  findAll({ start, limit }: PaginationQueryDto, { where, relations }: IFind) {
    return this.stateRepository.find({
      start,
      limit,
      where,
      relations,
    });
  }

  findOne({ where, relations, select }: IFindOne<Country>) {
    return this.stateRepository.findOne({ where, relations, select });
  }
}
