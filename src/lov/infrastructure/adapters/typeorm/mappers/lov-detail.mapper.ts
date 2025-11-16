import { User } from '@users/domain/entities/user';
import { UserEntity } from '@users/infrastructure/adapters/typeorm/entities/user.entity';
import { ListOfValuesEntity } from '../entities/lov.entity';
import { ListOfValuesDetailEntity } from '../entities/lov-detail.entity';
import { ListOfValues } from '@lov/domain/entities/lov';
import { ListOfValuesDetail } from '@lov/domain/entities/lov-detail';
import { UserMapper } from '@users/infrastructure/adapters/typeorm/mappers/user.mapper';

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

  private static mapKeyToDomain(
    listOfValuesEntity?: ListOfValuesEntity,
  ): ListOfValues {
    const listOfValues = new ListOfValues(listOfValuesEntity.id);
    listOfValues.key = listOfValuesEntity.key;
    return listOfValues;
  }

  private static mapUserReferenceToDomain(userEntity?: UserEntity): User {
    return UserMapper.toDomain(userEntity);
  }
}
