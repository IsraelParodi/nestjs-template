import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';

import { StateEntity } from '../entities/states.entity';
import { StateMapper } from '../mappers/state.mapper';
import { State } from '@localities/domain/entities/state';
import { PageableService } from '@common/services/pageable.service';
import { PaginationOptions } from '@iam/application/ports/outbound/role.repository';
import { StateRepository } from '@localities/application/ports/outbound/state.repository';

@Injectable()
export class TypeOrmStateRepository implements StateRepository {
  constructor(
    @InjectRepository(StateEntity)
    private readonly stateRepository: Repository<StateEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async findByCountryAndStateId(
    countryId: number,
    stateId: number,
  ): Promise<State> {
    const entity = await this.stateRepository.findOne({
      where: { countryId, id: stateId },
    });

    return entity ? StateMapper.toDomain(entity) : null;
  }

  async findAllPaginated(
    countryId: number,
    options: PaginationOptions,
  ): Promise<PaginatedResult<State>> {
    const [states, total] = await this.stateRepository.findAndCount({
      where: { countryId },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'ASC' },
    });

    const data = states.map((entity) => StateMapper.toDomain(entity));

    return this.pageableService.getPages({
      data,
      total,
      page: options.page,
      limit: options.limit,
    });
  }
}
