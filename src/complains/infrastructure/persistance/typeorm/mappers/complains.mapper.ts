import { UserEntity } from '@users/infrastructure/adapters/typeorm/entities/user.entity';
import { ComplainsEntity } from '../entities/complains.entity';
import { Complains } from '@complains/domain/entities/complains';
import { CountryEntity } from '@localities/infrastructure/adapters/typeorm/entities/country.entity';
import { Country } from '@localities/domain/entities/country';
import { CountryMapper } from '@localities/infrastructure/adapters/typeorm/mappers/country.mapper';
import { StateMapper } from '@localities/infrastructure/adapters/typeorm/mappers/state.mapper';
import { StateEntity } from '@localities/infrastructure/adapters/typeorm/entities/states.entity';
import { State } from '@localities/domain/entities/state';
import { User } from '@users/domain/entities/user';
import { UserMapper } from '@users/infrastructure/adapters/typeorm/mappers/user.mapper';

export class ComplainsMapper {
  static toDomain(complainsEntity: ComplainsEntity): Complains {
    const complains = new Complains(complainsEntity.id);

    complains.code = complainsEntity.code;
    complains.status = complainsEntity.status;
    complains.nationalTaxpayerRegistry =
      complainsEntity.nationalTaxpayerRegistry;
    complains.companyName = complainsEntity.companyName;
    complains.documentType = complainsEntity.documentType;
    complains.documentNumber = complainsEntity.documentNumber;
    complains.complainerName = complainsEntity.complainerName;
    complains.complainerAddress = complainsEntity.complainerAddress;
    complains.complainerDistrict = complainsEntity.complainerDistrict;
    complains.complainerPhone = complainsEntity.complainerPhone;
    complains.complainerPhoneCode = complainsEntity.complainerPhoneCode;
    complains.complainerEmail = complainsEntity.complainerEmail;
    if (complainsEntity.complainerState) {
      complains.complainerState = this.mapStateReferenceToDomain(
        complainsEntity.complainerState,
      );
    }
    if (complainsEntity.complainerCountry) {
      complains.complainerCountry = this.mapCountryReferenceToDomain(
        complainsEntity.complainerCountry,
      );
    }
    complains.serviceType = complainsEntity.serviceType;
    complains.currency = complainsEntity.currency;
    complains.amountComplained = complainsEntity.amountComplained;
    complains.description = complainsEntity.description;
    complains.type = complainsEntity.type;
    complains.detail = complainsEntity.detail;
    complains.request = complainsEntity.request;
    complains.emailsCopied = complainsEntity.emailsCopied;
    complains.updatedBy = this.mapUserReferenceToDomain(
      complainsEntity.updatedBy,
    );
    complains.createdAt = complainsEntity.createdAt;
    complains.updatedAt = complainsEntity.updatedAt;

    return complains;
  }

  static toPersistence(complains: Complains): ComplainsEntity {
    const entity = new ComplainsEntity();

    entity.id = complains.id;
    entity.code = complains.code;
    entity.status = complains.status;
    entity.nationalTaxpayerRegistry = complains.nationalTaxpayerRegistry;
    entity.companyName = complains.companyName;
    entity.documentType = complains.documentType;
    entity.documentNumber = complains.documentNumber;
    entity.complainerName = complains.complainerName;
    entity.complainerAddress = complains.complainerAddress;
    entity.complainerDistrict = complains.complainerDistrict;
    entity.complainerPhone = complains.complainerPhone;
    entity.complainerPhoneCode = complains.complainerPhoneCode;
    entity.complainerEmail = complains.complainerEmail;
    if (complains.complainerState) {
      entity.complainerState = this.mapStateReferenceToPersistence(
        complains.complainerState,
      );
    }
    if (complains.complainerCountry) {
      entity.complainerCountry = this.mapCountryReferenceToPersistence(
        complains.complainerCountry,
      );
    }
    entity.serviceType = complains.serviceType;
    entity.currency = complains.currency;
    entity.amountComplained = complains.amountComplained;
    entity.description = complains.description;
    entity.type = complains.type;
    entity.detail = complains.detail;
    entity.request = complains.request;
    entity.emailsCopied = complains.emailsCopied;
    entity.createdAt = complains.createdAt;
    entity.updatedAt = complains.updatedAt;

    return entity;
  }

  private static mapUserReferenceToDomain(userEntity?: UserEntity): User {
    return UserMapper.toDomain(userEntity);
  }

  private static mapCountryReferenceToDomain(
    countryEntity?: CountryEntity,
  ): Country {
    return CountryMapper.toDomain(countryEntity);
  }

  private static mapCountryReferenceToPersistence(
    country?: Country,
  ): CountryEntity {
    return CountryMapper.toPersistence(country);
  }

  private static mapStateReferenceToDomain(stateEntity?: StateEntity): State {
    return StateMapper.toDomain(stateEntity);
  }

  private static mapStateReferenceToPersistence(state?: State): StateEntity {
    return StateMapper.toPersistence(state);
  }
}
