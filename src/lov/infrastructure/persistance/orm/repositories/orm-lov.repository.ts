import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';

import { ListOfValues } from '@lov/domain/lov';
import { ListOfValuesRepository } from '@lov/domain/repositories/lov.repository';

import { ListOfValuesEntity } from '../entities/lov.entity';
import { ListOfValuesMapper } from '../mappers/lov.mapper';
import { PageableService } from '@common/services/pageable.service';

@Injectable()
export class OrmListOfValuesRepository implements ListOfValuesRepository {
  constructor(
    @InjectRepository(ListOfValuesEntity)
    private readonly listOfValues: Repository<ListOfValuesEntity>,
    private readonly pageableService: PageableService,
  ) { }

  async save(listOfValues: ListOfValues): Promise<ListOfValues> {
    const persistenceModel = ListOfValuesMapper.toPersistence(listOfValues);
    const newEntity = await this.listOfValues.save(persistenceModel);

    return ListOfValuesMapper.toDomain(newEntity);
  }

  async update(listOfValues: ListOfValues): Promise<ListOfValues> {
    const persistenceModel = ListOfValuesMapper.toPersistence(listOfValues);

    await this.listOfValues.update(
      { id: persistenceModel.id },
      persistenceModel,
    );

    return ListOfValuesMapper.toDomain(persistenceModel);
  }

  async findOne({
    where,
    relations,
    select
  }: IFindOne<ListOfValues>): Promise<ListOfValues> {
    const wherePartial: Partial<ListOfValues> = where;

    const entity = await this.listOfValues.findOne({
      where: wherePartial,
      relations,
      select,
    });

    return entity ? ListOfValuesMapper.toDomain(entity) : null;
  };

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<ListOfValues>> {
    const [listOfValues, total] = await this.listOfValues.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });

    const data = listOfValues.map((listOfValues) =>
      ListOfValuesMapper.toDomain(listOfValues),
    );

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.listOfValues.delete({ id });
  }
}
