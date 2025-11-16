import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { IFind, IFindOne, PaginatedResult } from '@common/interfaces/commons.interface';
import { TrackingsRepository } from '@trackings/domain/repositories/trackings.repository';
import { PageableService } from '@common/services/pageable.service';
import { TrackingEntity } from '../entities/tracking.entity';
import { Tracking } from '@trackings/domain/tracking';
import { TrackingMapper } from '../mappers/trackings.mapper';
import { ContainerEntity } from '../entities/container.entity';
import { SealEntity } from '../entities/seal.entity';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';
import { DeleteManyDto } from '@common/dto/delete-many.dto';

@Injectable()
export class OrmTrackingsRepository implements TrackingsRepository {
  constructor(
    @InjectRepository(TrackingEntity)
    private readonly trackingsRepository: Repository<TrackingEntity>,
    @InjectRepository(ContainerEntity)
    private readonly containersRepository: Repository<ContainerEntity>,
    @InjectRepository(SealEntity)
    private readonly sealsRepository: Repository<SealEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async save(trackings: Tracking): Promise<Tracking> {
    const persistenceModel = TrackingMapper.toPersistence(trackings);

    const createdBy = new UserEntity();
    createdBy.id = trackings.createdBy.id;

    persistenceModel.containers.forEach((container) => (container.createdBy = createdBy));
    persistenceModel.seals.forEach((container) => (container.createdBy = createdBy));

    const newEntity = await this.trackingsRepository.save(persistenceModel);

    return TrackingMapper.toDomain(newEntity);
  }

  async update(trackings: Tracking): Promise<Tracking> {
    const persistenceModel = TrackingMapper.toPersistence(trackings);

    await this.upsertEntities(this.containersRepository, persistenceModel.containers, persistenceModel);
    await this.upsertEntities(this.sealsRepository, persistenceModel.seals, persistenceModel);

    const trackingToSave = { ...persistenceModel };
    delete trackingToSave.containers;
    delete trackingToSave.seals;

    await this.trackingsRepository.save(trackingToSave);

    const updatedTracking = await this.trackingsRepository.findOne({
      where: { id: persistenceModel.id },
      relations: ['containers', 'seals', 'createdBy', 'updatedBy'],
    });

    return TrackingMapper.toDomain(updatedTracking);
  }

  async create(trackings: Tracking): Promise<Tracking> {
    const persistenceModel = TrackingMapper.toPersistence(trackings);
    const tracking = await this.trackingsRepository.save(persistenceModel);
    return TrackingMapper.toDomain(tracking);
  }

  async findOne({ where, relations, select }: IFindOne<Tracking>): Promise<Tracking> {
    const wherePartial: Omit<Partial<Tracking>, 'containers' | 'seals'> = where;
    const entity = await this.trackingsRepository.findOne({
      where: wherePartial,
      relations,
      select,
      withDeleted: true,
    });

    return TrackingMapper.toDomain(entity);
  }

  async find({ where, relations, start, limit }: IFind): Promise<PaginatedResult<Tracking>> {
    let trackings: TrackingEntity[] = [];
    let total = 0;

    const query = this.trackingsRepository
      .createQueryBuilder('tracking')
      .leftJoinAndSelect('tracking.consignee', 'consignee')
      .leftJoinAndSelect('tracking.notifier', 'notifier')
      .leftJoinAndSelect('tracking.containers', 'containers')
      .leftJoinAndSelect('tracking.seals', 'seals')
      .leftJoinAndSelect('containers.createdBy', 'containerCreatedBy')
      .leftJoinAndSelect('seals.createdBy', 'sealCreatedBy')
      .leftJoinAndSelect('tracking.createdBy', 'trackingCreatedBy')
      .leftJoinAndSelect('tracking.updatedBy', 'trackingUpdatedBy')
      .orderBy('tracking.id', 'DESC')
      .skip(start)
      .take(limit);

    if (where.userId) {
      query.andWhere('(consignee.id = :id OR notifier.id = :id)', {
        id: where.userId,
      });
    }

    if (where.routing) {
      query.andWhere('(routing = :routing)', {
        routing: where.routing,
      });
    }

    [trackings, total] = await query.getManyAndCount();
    const data = trackings.map((tracking) => TrackingMapper.toDomain(tracking));

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number, deletedBy): Promise<DeleteResult> {
    const tracking = await this.trackingsRepository.findOne({
      where: { id },
      relations: ['containers', 'seals'],
    });

    if (!tracking) {
      throw new NotFoundException(`Tracking with id ${id} not found`);
    }

    await Promise.all([
      this.trackingsRepository.update(id, { deletedBy }),
      this.containersRepository.update({ tracking: { id } }, { deletedBy }),
      this.sealsRepository.update({ tracking: { id } }, { deletedBy }),
    ]);

    await Promise.all([
      this.containersRepository.softDelete({ tracking: { id } }),
      this.sealsRepository.softDelete({ tracking: { id } }),
    ]);

    return this.trackingsRepository.softDelete({ id });
  }

  async deleteMany(deleteManyDto: DeleteManyDto, deletedBy: Partial<UserEntity>): Promise<any> {
    const { ids } = deleteManyDto;
    const currentDate = new Date();

    const trackings = await this.trackingsRepository.find({
      where: { id: In(ids) },
      relations: ['containers', 'seals'],
    });

    if (trackings.length === 0) {
      throw new BadRequestException('No trackings found for delete');
    }

    const containerIds = trackings.flatMap((tracking) => tracking.containers.map((container) => container.id));
    const sealIds = trackings.flatMap((tracking) => tracking.seals.map((seal) => seal.id));

    await Promise.all([
      this.containersRepository.update({ id: In(containerIds) }, { deletedBy, deletedAt: currentDate }),
      this.sealsRepository.update({ id: In(sealIds) }, { deletedBy, deletedAt: currentDate }),
      this.trackingsRepository.update({ id: In(ids) }, { deletedBy, deletedAt: currentDate }),
    ]);

    await Promise.all([
      this.containersRepository.softDelete({ id: In(containerIds) }),
      this.sealsRepository.softDelete({ id: In(sealIds) }),
      this.trackingsRepository.softDelete({ id: In(ids) }),
    ]);
  }

  async restore(id: number): Promise<DeleteResult> {
    return this.trackingsRepository.restore({ id });
  }

  async upsertEntities(repository: any, entities: any[], trackingPersistence: any) {
    const existingEntities = await repository.find();
    const existingIds = existingEntities.map((e: any) => e.id);

    const incomingIds: string[] = [];

    for (const entityData of entities) {
      const entityId = entityData.id;

      if (entityId) {
        incomingIds.push(entityId);
        const existingEntity = await repository.findOne({ where: { id: entityId } });

        if (existingEntity) {
          console.log(`🔄 Updating existing entity with ID: ${entityId}`);
          entityData.updatedBy = trackingPersistence.updatedBy.id;
          await repository.save(entityData);
        }
      } else {
        console.log('➕ No ID provided. Creating a new entity.');
        const newEntity = repository.create({
          ...entityData,
          tracking: trackingPersistence,
          createdBy: trackingPersistence.createdBy.id,
        });
        const savedEntity = await repository.save(newEntity);
        incomingIds.push(savedEntity.id);
      }
    }

    const idsToDelete = existingIds.filter((id: string) => !incomingIds.includes(id));

    for (const id of idsToDelete) {
      await repository.delete(id);
    }
  }
}
