import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { QuotationsMapper } from '../mappers/quotations.mapper';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { QuotationsEntity } from '../entities/quotations.entity';
import { Quotations } from '@quotations/domain/quotations';
import { PageableService } from '@common/services/pageable.service';
import { QuotationsRepository } from '@quotations/application/ports/outbound/quotations.repository';
import { PaginationOptions } from '@users/application/ports/outbound/user.repository';

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

  async findById(id: number): Promise<Quotations> {
    const entity = await this.quotationsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'country'],
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`Quotations with ID ${id} not found`);
    }

    return QuotationsMapper.toDomain(entity);
  }

  async findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Quotations>> {
    const [quotations, total] = await this.quotationsRepository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const data = quotations.map((entity) => QuotationsMapper.toDomain(entity));

    return this.pageableService.getPages({
      data,
      total,
      page: options.page,
      limit: options.limit,
    });
  }

  async delete(id: number): Promise<void> {
    await this.quotationsRepository.softDelete({ id });
  }

  async deleteMany(ids: number[], deletedBy: number): Promise<void> {
    await this.quotationsRepository.update(
      { id: In(ids) },
      { deletedBy: deletedBy as any },
    );
    await this.quotationsRepository.softDelete({ id: In(ids) });
  }
}
