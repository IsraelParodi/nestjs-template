import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ListOfValuesRepository } from '@lov/application/ports/outbound/lov.repository';
import { ListOfValuesEntity } from '../entities/lov.entity';
import { ListOfValuesMapper } from '../mappers/lov.mapper';
import { PageableService } from '@common/services/pageable.service';
import { ListOfValues } from '@lov/domain/entities/lov';
import { PaginationOptions } from '@users/application/ports/outbound/user.repository';

@Injectable()
export class TypeOrmListOfValuesRepository implements ListOfValuesRepository {
  constructor(
    @InjectRepository(ListOfValuesEntity)
    private readonly listOfValues: Repository<ListOfValuesEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async findChildByKey(key: string, valueId: number) {
    const lov = await this.findByKey(key);

    const valueFound = lov.values?.find((value) => value.id === valueId);

    if (!valueFound) {
      throw new BadRequestException(
        `Don't exist a LOV Detail with id: ${valueId} in LOV with key: ${key}`,
      );
    }

    return valueFound;
  }

  async findChildByName(key: string, name: string) {
    const lov = await this.findByKey(key);

    const valueFound = lov.values?.find((value) => value.name === name);

    if (!valueFound) {
      throw new BadRequestException(
        `Don't exist a LOV Detail with name: ${name} in LOV with key: ${key}`,
      );
    }

    return valueFound;
  }

  async save(listOfValues: ListOfValues): Promise<ListOfValues> {
    const persistenceModel = ListOfValuesMapper.toPersistence(listOfValues);
    const newEntity = await this.listOfValues.save(persistenceModel);

    return ListOfValuesMapper.toDomain(newEntity);
  }

  async findById(id: number): Promise<ListOfValues> {
    const entity = await this.listOfValues.findOne({
      where: { id },
      relations: ['values', 'createdBy'],
    });

    return entity ? ListOfValuesMapper.toDomain(entity) : null;
  }

  async findByKey(key: string): Promise<ListOfValues> {
    const entity = await this.listOfValues.findOne({
      where: { key },
      relations: ['values', 'createdBy'],
    });

    return entity ? ListOfValuesMapper.toDomain(entity) : null;
  }

  async findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<ListOfValues>> {
    const [lovs, total] = await this.listOfValues.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const data = lovs.map((entity) => ListOfValuesMapper.toDomain(entity));

    return this.pageableService.getPages({
      data,
      total,
      page: options.page,
      limit: options.limit,
    });
  }

  async delete(id: number): Promise<void> {
    await this.listOfValues.delete({ id });
  }
}
