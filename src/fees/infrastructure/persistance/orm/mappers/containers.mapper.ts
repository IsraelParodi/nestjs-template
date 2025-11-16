import { Container } from '@fees/domain/container';
import { ContainerEntity } from '../entities/container.entity';
import { FeeMapper } from './fees.mapper';

export class ContainerMapper {
  static toDomain(containerEntity: ContainerEntity): Container {
    const container = new Container(Number(containerEntity.id));

    container.size = containerEntity.size;
    container.amount = Number(containerEntity.amount);
    container.fee = containerEntity.fee ? FeeMapper.toDomain(containerEntity.fee) : undefined;
    container.createdAt = containerEntity.createdAt;
    container.updatedAt = containerEntity.updatedAt;

    return container;
  }

  static toPersistence(container: Container): ContainerEntity {
    const entity = new ContainerEntity();

    entity.id = container.id || undefined;
    entity.size = container.size;
    entity.amount = Number(container.amount);
    entity.fee = container.fee ? FeeMapper.toPersistence(container.fee) : undefined;
    entity.createdAt = container.createdAt;
    entity.updatedAt = container.updatedAt;

    return entity;
  }
}
