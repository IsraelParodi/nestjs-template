import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { IFind, IFindOne, PaginatedResult } from '@common/interfaces/commons.interface';
import { FeesRepository } from '@fees/domain/repositories/fees.repository';
import { PageableService } from '@common/services/pageable.service';
import { FeeEntity } from '../entities/fee.entity';
import { Fee } from '@fees/domain/fee';
import { FeeMapper } from '../mappers/fees.mapper';
import { ContainerEntity } from '../entities/container.entity';
import { ExpenseEntity } from '../entities/expense.entity';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

@Injectable()
export class OrmFeesRepository implements FeesRepository {
  constructor(
    @InjectRepository(FeeEntity)
    private readonly feesRepository: Repository<FeeEntity>,
    @InjectRepository(ContainerEntity)
    private readonly containersRepository: Repository<ContainerEntity>,
    @InjectRepository(ExpenseEntity)
    private readonly expensesRepository: Repository<ExpenseEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async save(fees: Fee): Promise<Fee> {
    const persistenceModel = FeeMapper.toPersistence(fees);
    const newEntity = await this.feesRepository.save(persistenceModel);

    return FeeMapper.toDomain(newEntity);
  }

  async update(fees: Fee): Promise<Fee> {
    const persistenceModel = FeeMapper.toPersistence(fees);

    await this.upsertEntities(this.containersRepository, persistenceModel.containers, persistenceModel);
    await this.upsertEntities(this.expensesRepository, persistenceModel.expenses, persistenceModel);

    const feeToSave = { ...persistenceModel };
    delete feeToSave.containers;
    delete feeToSave.expenses;

    await this.feesRepository.save(feeToSave);

    const updatedFee = await this.feesRepository.findOne({
      where: { id: persistenceModel.id },
      relations: ['containers', 'expenses', 'createdBy', 'updatedBy'],
    });

    return FeeMapper.toDomain(updatedFee);
  }

  async create(fees: Fee): Promise<Fee> {
    const persistenceModel = FeeMapper.toPersistence(fees);
    const fee = await this.feesRepository.save(persistenceModel);
    return FeeMapper.toDomain(fee);
  }

  async findOne({ where, relations, select }: IFindOne<Fee>): Promise<Fee> {
    const wherePartial: Omit<Partial<Fee>, 'containers' | 'expenses'> = where;
    const entity = await this.feesRepository.findOne({
      where: wherePartial,
      relations,
      select,
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`Fee with ID ${where.id} not found`);
    }

    return FeeMapper.toDomain(entity);
  }

  async find({ where, relations, start, limit, order }: IFind): Promise<PaginatedResult<Fee>> {
    const [fees, total] = await this.feesRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
      order,
    });

    const data = fees.map((fees) => FeeMapper.toDomain(fees));

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number): Promise<DeleteResult> {
    const fee = await this.feesRepository.findOne({
      where: { id },
      relations: ['containers', 'expenses'],
    });

    await Promise.all([this.containersRepository.softDelete({ fee }), this.expensesRepository.softDelete({ fee })]);

    return this.feesRepository.softDelete({ id });
  }

  async deleteMany(deleteManyDto: DeleteManyDto, deletedBy: Partial<UserEntity>): Promise<any> {
    const { ids } = deleteManyDto;
    const currentDate = new Date();

    const fees = await this.feesRepository.find({
      where: { id: In(ids) },
      relations: ['containers', 'expenses'],
    });

    if (fees.length === 0) {
      throw new BadRequestException('No fees found for delete');
    }

    const containerIds = fees.flatMap((fee) => fee.containers.map((container) => container.id));
    const expenseIds = fees.flatMap((fee) => fee.expenses.map((expense) => expense.id));

    await Promise.all([
      this.containersRepository.update({ id: In(containerIds) }, { deletedBy: deletedBy, deletedAt: currentDate }),
      this.expensesRepository.update({ id: In(expenseIds) }, { deletedBy: deletedBy, deletedAt: currentDate }),
    ]);

    await this.feesRepository.update({ id: In(ids) }, { deletedBy: deletedBy, deletedAt: currentDate });

    return this.feesRepository.softDelete({ id: In(ids) });
  }

  async restore(id: number): Promise<DeleteResult> {
    return this.feesRepository.restore({ id });
  }

  async upsertEntities(repository: any, entities: any[], feePersistence: any) {
    const existingEntities = await repository.find();
    const existingIds = existingEntities.map((e: any) => e.id);

    const incomingIds: string[] = [];

    for (const entityData of entities) {
      const entityId = entityData.id;

      if (entityId) {
        incomingIds.push(entityId);
        console.log(`🔍 Checking entity ID: ${entityId}`);
        const existingEntity = await repository.findOne({
          where: { id: entityId },
        });

        if (existingEntity) {
          console.log(`🔄 Updating existing entity with ID: ${entityId}`);
          entityData.updatedBy = feePersistence.updatedBy.id;
          await repository.save(entityData);
        }
      } else {
        console.log('➕ No ID provided. Creating a new entity.');
        const newEntity = repository.create({
          ...entityData,
          fee: feePersistence,
          createdBy: feePersistence.createdBy.id,
        });
        const savedEntity = await repository.save(newEntity);
        incomingIds.push(savedEntity.id);
      }
    }

    const idsToDelete = existingIds.filter((id: string) => !incomingIds.includes(id));

    for (const id of idsToDelete) {
      console.log(`🗑️ Deleting entity with ID: ${id}`);
      await repository.delete(id);
    }
  }
}
