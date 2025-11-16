import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, In, Repository } from 'typeorm';
import { QuotationsMapper } from '../mappers/quotations.mapper';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';
import { QuotationsEntity } from '../entities/quotations.entity';
import { Quotations } from '@quotations/domain/quotations';
import { QuotationsRepository } from '@quotations/domain/repositories/quotations.repository';
import { PageableService } from '@common/services/pageable.service';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

@Injectable()
export class OrmQuotationsRepository implements QuotationsRepository {
  constructor(
    @InjectRepository(QuotationsEntity)
    private readonly quotationsRepository: Repository<QuotationsEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async save(
    quotations: Quotations,
    manager?: EntityManager,
  ): Promise<Quotations> {
    const persistenceModel = QuotationsMapper.toPersistence(quotations);
    const repository = manager
      ? manager.getRepository(QuotationsEntity)
      : this.quotationsRepository;

    const newEntity = await repository.save(persistenceModel);

    return QuotationsMapper.toDomain(newEntity);
  }

  async update(quotations: Quotations): Promise<Quotations> {
    const persistenceModel = QuotationsMapper.toPersistence(quotations);

    await this.quotationsRepository.save(persistenceModel);

    return QuotationsMapper.toDomain(persistenceModel);
  }

  async create(quotations: Quotations): Promise<Quotations> {
    return this.quotationsRepository.save(quotations);
  }

  async findOne({
    where,
    relations,
    select,
  }: IFindOne<Quotations>): Promise<Quotations> {
    const entity = await this.quotationsRepository.findOne({
      where,
      relations,
      select,
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`Quotations with ID ${where.id} not found`);
    }

    return QuotationsMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<Quotations>> {
    const [quotations, total] = await this.quotationsRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
      order: { id: 'DESC' },
    });

    const data = quotations.map((quotations) =>
      QuotationsMapper.toDomain(quotations),
    );

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.quotationsRepository.softDelete({ id });
  }

  async deleteMany(
    deleteManyDto: DeleteManyDto,
    deletedBy: Partial<UserEntity>,
  ): Promise<DeleteResult> {
    const { ids } = deleteManyDto;
    await this.quotationsRepository.update(
      { id: In(ids) },
      { deletedBy: deletedBy },
    );
    return this.quotationsRepository.softDelete({ id: In(ids) });
  }

  async restore(id: number): Promise<DeleteResult> {
    return this.quotationsRepository.restore({ id });
  }
}
