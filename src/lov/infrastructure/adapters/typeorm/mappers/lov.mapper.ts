import { User } from '@users/domain/entities/user';
import { UserEntity } from '@users/infrastructure/adapters/typeorm/entities/user.entity';

import { ListOfValuesEntity } from '../entities/lov.entity';

import { ListOfValuesDetailEntity } from '../entities/lov-detail.entity';
import { ListOfValuesDetailMapper } from './lov-detail.mapper';
import { UserMapper } from '@users/infrastructure/adapters/typeorm/mappers/user.mapper';
import { ListOfValues } from '@lov/domain/entities/lov';

export class ListOfValuesMapper {
  static toDomain(listOfValuesEntity: ListOfValuesEntity): ListOfValues {
    const listOfValues = new ListOfValues(listOfValuesEntity.id);

    listOfValues.key = listOfValuesEntity.key;
    listOfValues.description = listOfValuesEntity.description;

    const valuesIsArray = Array.isArray(listOfValuesEntity.values);
    const valuesHasData = listOfValuesEntity.values?.length != 0;

    if (valuesIsArray && valuesHasData) {
      listOfValues.values = this.mapListOfValuesDetailReferenceToDomain(
        listOfValuesEntity.values,
      );
    }

    if (listOfValuesEntity.createdBy) {
      listOfValues.createdBy = this.mapUserReferenceToDomain(
        listOfValuesEntity.createdBy,
      );
    }

    if (listOfValuesEntity.updatedBy) {
      listOfValues.updatedBy = this.mapUserReferenceToDomain(
        listOfValuesEntity.updatedBy,
      );
    }
    listOfValues.createdAt = listOfValuesEntity.createdAt;
    listOfValues.updatedAt = listOfValuesEntity.updatedAt;

    return listOfValues;
  }

  static toPersistence(listOfValues: ListOfValues): ListOfValuesEntity {
    const entity = new ListOfValuesEntity();

    if (listOfValues.id !== undefined) {
      entity.id = listOfValues.id;
    }

    entity.key = listOfValues.key;
    entity.description = listOfValues.description;

    if (listOfValues.createdBy) {
      entity.createdBy = this.mapUserReferenceToPersistence(
        listOfValues.createdBy,
      );
    }

    if (listOfValues.updatedBy) {
      entity.updatedBy = this.mapUserReferenceToPersistence(
        listOfValues.updatedBy,
      );
    }

    entity.createdAt = listOfValues.createdAt;
    entity.updatedAt = listOfValues.updatedAt;

    return entity;
  }

  private static mapListOfValuesDetailReferenceToDomain(
    listOfValuesDetailEntity: ListOfValuesDetailEntity[],
  ) {
    return listOfValuesDetailEntity.map((value) =>
      ListOfValuesDetailMapper.toDomainEmbeded(value),
    );
  }

  private static mapUserReferenceToDomain(userEntity?: UserEntity): User {
    return UserMapper.toDomain(userEntity);
  }

  private static mapUserReferenceToPersistence(user?: User): UserEntity {
    return UserMapper.toPersistence(user) as UserEntity;
  }
}
