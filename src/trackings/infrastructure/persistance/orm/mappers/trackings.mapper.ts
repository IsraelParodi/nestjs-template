import { Tracking } from '@trackings/domain/tracking';
import { TrackingEntity } from '../entities/tracking.entity';
import { ContainerMapper } from './containers.mapper';
import { SealMapper } from './seals.mapper';
import { UserMapper } from '@users/infrastructure/persistance/orm/mappers/user.mapper';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

export class TrackingMapper {
  static toDomain(trackingEntity: TrackingEntity): Tracking {
    const tracking = new Tracking(trackingEntity?.id);

    tracking.consignee = UserMapper.mapUserReferenceToDomain(trackingEntity?.consignee);
    tracking.notifier = UserMapper.mapUserReferenceToDomain(trackingEntity?.notifier);
    tracking.shipper = trackingEntity?.shipper;
    tracking.routing = trackingEntity?.routing;
    tracking.customsOffice = trackingEntity?.customsOffice;
    tracking.blAuthorization = trackingEntity?.blAuthorization;
    tracking.regime = trackingEntity?.regime;
    tracking.mbl_mawb = trackingEntity?.mbl_mawb;
    tracking.hbl_mawb = trackingEntity?.hbl_mawb;
    tracking.origin = trackingEntity?.origin;
    tracking.destination = trackingEntity?.destination;
    tracking.etd = trackingEntity?.etd;
    tracking.eta = trackingEntity?.eta;

    tracking.containers = trackingEntity?.containers?.map(ContainerMapper.toDomain) ?? [];
    tracking.seals = trackingEntity?.seals?.map(SealMapper.toDomain) ?? [];

    tracking.createdAt = trackingEntity?.createdAt;
    tracking.createdBy = UserMapper.mapUserReferenceToDomain(trackingEntity?.createdBy);
    tracking.updatedAt = trackingEntity?.updatedAt;
    tracking.updatedBy = UserMapper.mapUserReferenceToDomain(trackingEntity?.updatedBy);

    return tracking;
  }

  static toPersistence(tracking: Tracking): TrackingEntity {
    const entity = new TrackingEntity();

    entity.id = tracking.id;

    const consignee = new UserEntity();
    consignee.id = tracking.consignee as unknown as number;
    entity.consignee = consignee;

    const notifier = new UserEntity();
    notifier.id = tracking.notifier as unknown as number;

    entity.notifier = notifier;
    entity.shipper = tracking.shipper;
    entity.routing = tracking.routing;
    entity.customsOffice = tracking.customsOffice;
    entity.blAuthorization = tracking.blAuthorization;
    entity.regime = tracking.regime;
    entity.mbl_mawb = tracking.mbl_mawb;
    entity.hbl_mawb = tracking.hbl_mawb;
    entity.origin = tracking.origin;
    entity.destination = tracking.destination;
    entity.etd = tracking.etd;
    entity.eta = tracking.eta;

    entity.containers = tracking.containers?.map(ContainerMapper.toPersistence) ?? [];
    entity.seals = tracking.seals?.map(SealMapper.toPersistence) ?? [];

    entity.createdBy = UserMapper.mapUserReferenceToPersistence(tracking.createdBy);
    entity.createdAt = tracking.createdAt;
    entity.updatedBy = UserMapper.mapUserReferenceToPersistence(tracking.updatedBy);
    entity.updatedAt = tracking.updatedAt;

    return entity;
  }
}
