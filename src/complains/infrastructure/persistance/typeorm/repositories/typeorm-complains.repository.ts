import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplainsMapper } from '../mappers/complains.mapper';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ComplainsEntity } from '../entities/complains.entity';
import { Complains } from '@complains/domain/entities/complains';
import { PageableService } from '@common/services/pageable.service';
import { ComplainsRepository } from '@complains/application/ports/outbound/complains.repository';
import { PaginationOptions } from '@users/application/ports/outbound/user.repository';

@Injectable()
export class TypeOrmComplainsRepository implements ComplainsRepository {
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

  async findById(id: number): Promise<Complains> {
    const entity = await this.complainsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`Complains with ID ${id} not found`);
    }

    return ComplainsMapper.toDomain(entity);
  }

  async findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Complains>> {
    const [complains, total] = await this.complainsRepository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const data = complains.map((entity) => ComplainsMapper.toDomain(entity));

    return this.pageableService.getPages({
      data,
      total,
      page: options.page,
      limit: options.limit,
    });
  }

  async delete(id: number): Promise<void> {
    await this.complainsRepository.softDelete({ id });
  }
}
