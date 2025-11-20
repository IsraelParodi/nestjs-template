import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ComplainsMapper } from '../mappers/complains.mapper';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';
import { ComplainsEntity } from '../entities/complains.entity';
import { Complains } from '@complains/domain/complains';
import { ComplainsRepository } from '@complains/domain/repositories/complains.repository';
import { PageableService } from '@common/services/pageable.service';

@Injectable()
export class OrmComplainsRepository implements ComplainsRepository {
  constructor(
    @InjectRepository(ComplainsEntity)
    private readonly complainsRepository: Repository<ComplainsEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async save(complains: Complains): Promise<Complains> {
    const persistenceModel = ComplainsMapper.toPersistence(complains);
    const newEntity = await this.complainsRepository.save(persistenceModel);

    return ComplainsMapper.toDomain(newEntity);
  }

  async update(complains: Complains): Promise<Complains> {
    const persistenceModel = ComplainsMapper.toPersistence(complains);

    await this.complainsRepository.update(
      { id: persistenceModel.id },
      persistenceModel,
    );

    return ComplainsMapper.toDomain(persistenceModel);
  }

  async create(complains: Complains): Promise<Complains> {
    return this.complainsRepository.save(complains);
  }

  async findOne({
    where,
    relations,
    select,
  }: IFindOne<Complains>): Promise<Complains> {
    const wherePartial: Omit<
      Partial<Complains>,
      'emailsCopied' | 'amountComplained'
    > = where;

    const entity = await this.complainsRepository.findOne({
      where: wherePartial,
      relations,
      select,
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`Complains with ID ${where.id} not found`);
    }

    return ComplainsMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<Complains>> {
    const [complains, total] = await this.complainsRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });

    const data = complains.map((complains) =>
      ComplainsMapper.toDomain(complains),
    );

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.complainsRepository.softDelete({ id });
  }

  async restore(id: number): Promise<DeleteResult> {
    return this.complainsRepository.restore({ id });
  }
}
