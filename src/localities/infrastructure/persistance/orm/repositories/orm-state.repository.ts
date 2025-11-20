import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';
import { StateRepository } from '@localities/domain/repositories/state.repository';
import { StateEntity } from '../entities/states.entity';
import { StateMapper } from '../mappers/state.mapper';
import { State } from '@localities/domain/state';
import { PageableService } from '@common/services/pageable.service';

@Injectable()
export class OrmStateRepository implements StateRepository {
  constructor(
    @InjectRepository(StateEntity)
    private readonly stateRepository: Repository<StateEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async save(state: State): Promise<State> {
    const persistenceModel = StateMapper.toPersistence(state);
    const newEntity = await this.stateRepository.save(persistenceModel);

    return StateMapper.toDomain(newEntity);
  }

  async create(state: State): Promise<State> {
    return this.stateRepository.save(state);
  }

  async findOne({ where, relations, select }: IFindOne<State>): Promise<State> {
    const entity = await this.stateRepository.findOne({
      where,
      relations,
      select,
    });

    if (!entity) {
      throw new NotFoundException(`State with ID ${where.id} not found`);
    }

    return StateMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<State>> {
    const [countries, total] = await this.stateRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });

    const data = countries.map((role) => StateMapper.toDomain(role));

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.stateRepository.softDelete({ id });
  }
}
