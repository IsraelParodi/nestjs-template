import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { IFindOne } from '@common/interfaces/commons.interface';

import { ListOfValuesDetail } from '@lov/domain/lov-detail';
import { ListOfValuesDetailRepository } from '@lov/domain/repositories/lov-detail.repository';

import { ListOfValuesDetailEntity } from '../entities/lov-detail.entity';
import { ListOfValuesDetailMapper } from '../mappers/lov-detail.mapper';
import { PageableService } from '@common/services/pageable.service';

@Injectable()
export class OrmListOfValuesDetailRepository
  implements ListOfValuesDetailRepository
{
  constructor(
    @InjectRepository(ListOfValuesDetailEntity)
    private readonly listOfValuesDetail: Repository<ListOfValuesDetailEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async update(
    listOfValuesDetail: ListOfValuesDetail,
  ): Promise<ListOfValuesDetail> {
    const persistenceModel =
      ListOfValuesDetailMapper.toPersistence(listOfValuesDetail);

    await this.listOfValuesDetail.update(
      { id: persistenceModel.id },
      persistenceModel,
    );

    return ListOfValuesDetailMapper.toDomain(persistenceModel);
  }

  async create(
    listOfValuesDetail: ListOfValuesDetail,
  ): Promise<ListOfValuesDetail> {
    return this.listOfValuesDetail.save(listOfValuesDetail);
  }

  async findOne({
    where,
    relations,
    select,
  }: IFindOne<ListOfValuesDetail>): Promise<ListOfValuesDetail> {
    const whereSpread: Partial<ListOfValuesDetail> = where;

    const entity = await this.listOfValuesDetail.findOne({
      where: whereSpread,
      relations,
      select,
      withDeleted: true,
    });

    return ListOfValuesDetailMapper.toDomain(entity);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.listOfValuesDetail.delete({ id });
  }
}
