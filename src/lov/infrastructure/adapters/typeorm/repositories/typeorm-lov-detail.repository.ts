import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListOfValuesDetailRepository } from '@lov/application/ports/outbound/lov-detail.repository';
import { ListOfValuesDetailEntity } from '../entities/lov-detail.entity';
import { ListOfValuesDetailMapper } from '../mappers/lov-detail.mapper';
import { ListOfValuesDetail } from '@lov/domain/entities/lov-detail';

@Injectable()
export class TypeOrmListOfValuesDetailRepository
  implements ListOfValuesDetailRepository
{
  constructor(
    @InjectRepository(ListOfValuesDetailEntity)
    private readonly listOfValuesDetail: Repository<ListOfValuesDetailEntity>,
  ) {}

  async save(
    listOfValuesDetail: ListOfValuesDetail,
  ): Promise<ListOfValuesDetail> {
    return this.listOfValuesDetail.save(listOfValuesDetail as any);
  }

  async findById(id: number): Promise<ListOfValuesDetail> {
    const entity = await this.listOfValuesDetail.findOne({
      where: { id },
    });

    return entity ? ListOfValuesDetailMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.listOfValuesDetail.delete({ id });
  }
}
