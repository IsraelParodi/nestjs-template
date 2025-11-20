import { User } from '@users/domain/user';
import { UserMapper } from '@users/infrastructure/persistance/orm/mappers/user.mapper';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

import { ListOfValues } from '@lov/domain/lov';
import { ListOfValuesEntity } from '../entities/lov.entity';

import { ListOfValuesDetail } from '@lov/domain/lov-detail';
import { ListOfValuesDetailEntity } from '../entities/lov-detail.entity';

export class ListOfValuesDetailMapper {
  static toDomain(
    listOfValuesEntity: ListOfValuesDetailEntity,
  ): ListOfValuesDetail {
    const listOfValues = new ListOfValuesDetail(listOfValuesEntity.id);

    listOfValues.key = this.mapKeyToDomain(listOfValuesEntity.key);
    listOfValues.name = listOfValuesEntity.name;
    listOfValues.detail = listOfValuesEntity.detail;

    listOfValues.createdBy = this.mapUserReferenceToDomain(
      listOfValuesEntity.createdBy,
    );
    listOfValues.updatedBy = this.mapUserReferenceToDomain(
      listOfValuesEntity.updatedBy,
    );
    listOfValues.createdAt = listOfValuesEntity.createdAt;
    listOfValues.updatedAt = listOfValuesEntity.updatedAt;

    return listOfValues;
  }

  static toDomainEmbeded(
    listOfValuesEntity: ListOfValuesDetailEntity,
  ): ListOfValuesDetail {
    const listOfValues = new ListOfValuesDetail(listOfValuesEntity.id);

    listOfValues.name = listOfValuesEntity.name;
    listOfValues.detail = listOfValuesEntity.detail;

    listOfValues.createdBy = this.mapUserReferenceToDomain(
      listOfValuesEntity.createdBy,
    );
    listOfValues.updatedBy = this.mapUserReferenceToDomain(
      listOfValuesEntity.updatedBy,
    );
    listOfValues.createdAt = listOfValuesEntity.createdAt;
    listOfValues.updatedAt = listOfValuesEntity.updatedAt;

    return listOfValues;
  }

  static toPersistence(
    listOfValuesDetail: ListOfValuesDetail,
  ): ListOfValuesDetailEntity {
    const entity = new ListOfValuesDetailEntity();

    entity.key = this.mapKeyToPersistence(listOfValuesDetail.key);
    entity.name = listOfValuesDetail.name;
    entity.detail = listOfValuesDetail.detail;

    entity.createdBy = this.mapUserReferenceToPersistence(
      listOfValuesDetail.createdBy,
    );
    entity.updatedBy = this.mapUserReferenceToPersistence(
      listOfValuesDetail.updatedBy,
    );
    entity.createdAt = listOfValuesDetail.createdAt;
    entity.updatedAt = listOfValuesDetail.updatedAt;

    return entity;
  }

  private static mapKeyToDomain(
    listOfValuesEntity?: ListOfValuesEntity,
  ): ListOfValues {
    if (!listOfValuesEntity) return null;
    const listOfValues = new ListOfValues(listOfValuesEntity.id);
    listOfValues.key = listOfValuesEntity.key;
    return listOfValues;
  }

  private static mapKeyToPersistence(
    listOfValues?: ListOfValues,
  ): ListOfValuesEntity {
    if (!listOfValues) return null;

    const listOfValuesEntity = new ListOfValuesEntity();
    listOfValuesEntity.id = listOfValues.id;
    listOfValuesEntity.key = listOfValues.key;
    return listOfValuesEntity;
  }

  private static mapUserReferenceToDomain(userEntity?: UserEntity): User {
    return UserMapper.mapUserReferenceToDomain(userEntity);
  }

  private static mapUserReferenceToPersistence(user?: User): UserEntity {
    return UserMapper.mapUserReferenceToPersistence(user);
  }
}
