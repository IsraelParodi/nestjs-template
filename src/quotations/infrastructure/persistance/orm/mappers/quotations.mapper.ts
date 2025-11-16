import { Quotations } from '@quotations/domain/quotations';
import { QuotationsEntity } from '../entities/quotations.entity';
import { User } from '@users/domain/entities/user';
import { UserEntity } from '@users/infrastructure/adapters/typeorm/entities/user.entity';
import { Country } from '@localities/domain/entities/country';
import { CountryEntity } from '@localities/infrastructure/adapters/typeorm/entities/country.entity';
import { CountryMapper } from '@localities/infrastructure/adapters/typeorm/mappers/country.mapper';
import { UserMapper } from '@users/infrastructure/adapters/typeorm/mappers/user.mapper';

export class QuotationsMapper {
  static toDomain(quotationsEntity: QuotationsEntity): Quotations {
    const quotations = new Quotations(quotationsEntity.id);

    quotations.name = quotationsEntity.name;
    quotations.lastname = quotationsEntity.lastname;
    quotations.userType = quotationsEntity.userType;
    quotations.email = quotationsEntity.email;
    quotations.phone = quotationsEntity.phone;
    quotations.phoneCode = quotationsEntity.phoneCode;
    quotations.transportType = quotationsEntity.transportType;

    quotations.documentType = quotationsEntity.documentType;
    quotations.documentNumber = quotationsEntity.documentNumber;
    quotations.shippingType = quotationsEntity.shippingType;
    quotations.cargoVolume = quotationsEntity.cargoVolume;
    quotations.containerCode = quotationsEntity.containerCode;
    quotations.origin = quotationsEntity.origin;
    quotations.destination = quotationsEntity.destination;

    const countryData = this.mapCountryReferenceToDomain(
      quotationsEntity.country,
    );
    quotations.country = {
      id: countryData?.id,
      name: countryData?.name,
      currency: countryData?.currency,
      phoneCode: countryData?.phoneCode,
      emoji: countryData?.emoji,
    };

    quotations.industryType = quotationsEntity.industryType;
    quotations.createdBy = this.mapUserReferenceToDomain(
      quotationsEntity.createdBy,
    );
    quotations.updatedBy = this.mapUserReferenceToDomain(
      quotationsEntity.updatedBy,
    );
    quotations.createdAt = quotationsEntity.createdAt;
    quotations.updatedAt = quotationsEntity.updatedAt;

    return quotations;
  }

  static toPersistence(quotations: Quotations): QuotationsEntity {
    const entity = new QuotationsEntity();

    entity.id = quotations.id;
    entity.name = quotations.name;
    entity.lastname = quotations.lastname;
    entity.userType = quotations.userType;
    entity.email = quotations.email;
    entity.phone = quotations.phone;
    entity.phoneCode = quotations.phoneCode;
    entity.transportType = quotations.transportType;

    entity.documentType = quotations.documentType;
    entity.documentNumber = quotations.documentNumber;
    entity.shippingType = quotations.shippingType;
    entity.cargoVolume = quotations.cargoVolume;
    entity.containerCode = quotations.containerCode;
    entity.origin = quotations.origin;
    entity.destination = quotations.destination;

    entity.country = this.mapCountryReferenceToPersistence(quotations.country);

    entity.industryType = quotations.industryType;
    entity.createdBy = this.mapUserReferenceToPersistence(quotations.createdBy);
    entity.updatedBy = this.mapUserReferenceToPersistence(quotations.updatedBy);
    entity.createdAt = quotations.createdAt;
    entity.updatedAt = quotations.updatedAt;

    return entity;
  }

  private static mapUserReferenceToDomain(userEntity?: UserEntity): User {
    return UserMapper.toDomain(userEntity);
  }

  private static mapUserReferenceToPersistence(user?: User): UserEntity {
    return UserMapper.toPersistence(user) as UserEntity;
  }

  private static mapCountryReferenceToDomain(
    countryEntity?: CountryEntity,
  ): Country {
    return CountryMapper.toDomain(countryEntity);
  }

  private static mapCountryReferenceToPersistence(
    country?: Partial<Country>,
  ): CountryEntity {
    return CountryMapper.toPersistence(country);
  }
}
