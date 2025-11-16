import { Seal } from '@trackings/domain/seal';
import { SealEntity } from '../entities/seal.entity';
import { TrackingMapper } from './trackings.mapper';

export class SealMapper {
  static toDomain(sealEntity: SealEntity): Seal {
    const seal = new Seal(Number(sealEntity.id));

    seal.name = sealEntity.name;
    seal.containerCode = sealEntity.containerCode;
    seal.description = sealEntity.description;
    seal.tracking = sealEntity.tracking ? TrackingMapper.toDomain(sealEntity.tracking) : undefined;
    seal.createdAt = sealEntity.createdAt;
    seal.updatedAt = sealEntity.updatedAt;

    return seal;
  }

  static toPersistence(seal: Seal): SealEntity {
    const entity = new SealEntity();

    entity.id = seal.id || undefined;
    entity.name = seal.name;
    entity.containerCode = seal.containerCode;
    entity.description = seal.description;

    return entity;
  }
}
