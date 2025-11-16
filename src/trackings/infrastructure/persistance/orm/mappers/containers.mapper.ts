import { Container } from '@trackings/domain/container';
import { ContainerEntity } from '../entities/container.entity';
import { TrackingMapper } from './trackings.mapper';
import { UserMapper } from '@users/infrastructure/persistance/orm/mappers/user.mapper';

export class ContainerMapper {
  static toDomain(containerEntity: ContainerEntity): Container {
    const container = new Container(Number(containerEntity.id));

    container.code = containerEntity.code;
    container.quantity = Number(containerEntity.quantity);
    container.kbr = containerEntity.kbr;
    container.m3 = containerEntity.m3;
    container.description = containerEntity.description;
    container.tracking = containerEntity.tracking ? TrackingMapper.toDomain(containerEntity.tracking) : undefined;
    container.createdBy = UserMapper.mapUserReferenceToDomain(containerEntity?.createdBy);
    container.createdAt = containerEntity.createdAt;
    container.updatedBy = UserMapper.mapUserReferenceToDomain(containerEntity?.updatedBy);
    container.updatedAt = containerEntity.updatedAt;

    return container;
  }

  static toPersistence(container: Container): ContainerEntity {
    const entity = new ContainerEntity();

    entity.id = container.id || undefined;
    entity.code = container.code;
    entity.quantity = Number(container.quantity);
    entity.kbr = container.kbr;
    entity.m3 = container.m3;
    entity.description = container.description;
    entity.tracking = container.tracking ? TrackingMapper.toPersistence(container.tracking) : undefined;
    entity.createdAt = container.createdAt;
    entity.updatedAt = container.updatedAt;

    return entity;
  }
}
