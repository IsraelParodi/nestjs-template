import { User } from '@users/domain/user';
import { UserMapper } from '@users/infrastructure/persistance/orm/mappers/user.mapper';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

import { ListOfValuesEntity } from '../entities/lov.entity';
import { ListOfValues } from '@lov/domain/lov';
import { ListOfValuesDetailEntity } from '../entities/lov-detail.entity';
import { ListOfValuesDetailMapper } from './lov-detail.mapper';

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

  static toPersistence(listOfValues: ListOfValues): ListOfValuesEntity {
    const entity = new ListOfValuesEntity();

    entity.key = listOfValues.key;
    entity.description = listOfValues.description;

    entity.createdBy = this.mapUserReferenceToPersistence(
      listOfValues.createdBy,
    );
    entity.updatedBy = this.mapUserReferenceToPersistence(
      listOfValues.updatedBy,
    );
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
    return UserMapper.mapUserReferenceToDomain(userEntity);
  }

  private static mapUserReferenceToPersistence(user?: User): UserEntity {
    return UserMapper.mapUserReferenceToPersistence(user);
  }
}
