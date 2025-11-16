import { ContactUs } from '@contact-us/domain/contact-us';
import { ContactUsEntity } from '../entities/contact-us.entity';
import { User } from '@users/domain/user';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';
import { UserMapper } from '@users/infrastructure/persistance/orm/mappers/user.mapper';
import { Country } from '@localities/domain/country';
import { CountryEntity } from '@localities/infrastructure/persistance/orm/entities/country.entity';
import { CountryMapper } from '@localities/infrastructure/persistance/orm/mappers/country.mapper';
import { CreateContactUsDto } from '@contact-us/presenters/dto/create-contact-us.dto';

export class ContactUsMapper {
  static toDomain(contactUsEntity: ContactUsEntity): ContactUs {
    const contactUs = new ContactUs(contactUsEntity.id);

    contactUs.name = contactUsEntity.name;
    contactUs.lastname = contactUsEntity.lastname;
    contactUs.email = contactUsEntity.email;
    contactUs.phoneCode = contactUsEntity.phoneCode;
    contactUs.phone = contactUsEntity.phone;
    contactUs.message = contactUsEntity.message;
    contactUs.acceptPrivacyPolicies = contactUsEntity.acceptPrivacyPolicies;
    contactUs.receiveAdditionalInformation = contactUsEntity.receiveAdditionalInformation;

    if (contactUsEntity.country) {
      const countryData = this.mapCountryReferenceToDomain(contactUsEntity.country);
      contactUs.country = {
        id: countryData?.id,
        name: countryData?.name,
        currency: countryData?.currency,
        phoneCode: countryData?.phoneCode,
        emoji: countryData?.emoji,
      };
    }

    contactUs.createdBy = this.mapUserReferenceToDomain(contactUsEntity.createdBy);
    contactUs.updatedBy = this.mapUserReferenceToDomain(contactUsEntity.updatedBy);
    contactUs.createdAt = contactUsEntity.createdAt;
    contactUs.updatedAt = contactUsEntity.updatedAt;

    return contactUs;
  }

  static fromDtotoDomain(dto: CreateContactUsDto): ContactUs {
    const contactUs = new ContactUs();

    contactUs.name = dto.name;
    contactUs.lastname = dto.lastname;
    contactUs.email = dto.email;
    contactUs.phoneCode = dto.phoneCode;
    contactUs.phone = dto.phone;
    contactUs.message = dto.message;
    contactUs.acceptPrivacyPolicies = dto.acceptPrivacyPolicies;
    contactUs.receiveAdditionalInformation = dto.receiveAdditionalInformation;
    contactUs.country = new Country(dto.country);
    contactUs.createdBy = new User(dto.createdBy);

    return contactUs;
  }

  static toPersistence(contactUs: ContactUs): ContactUsEntity {
    const entity = new ContactUsEntity();

    entity.id = contactUs.id;
    entity.name = contactUs.name;
    entity.lastname = contactUs.lastname;
    entity.email = contactUs.email;
    entity.phone = contactUs.phone;
    entity.message = contactUs.message;
    entity.acceptPrivacyPolicies = contactUs.acceptPrivacyPolicies;
    entity.receiveAdditionalInformation = contactUs.receiveAdditionalInformation;

    if (contactUs.country) {
      entity.country = this.mapCountryReferenceToPersistence(contactUs.country);
    }

    entity.createdBy = this.mapUserReferenceToPersistence(contactUs.createdBy);
    entity.updatedBy = this.mapUserReferenceToPersistence(contactUs.updatedBy);
    entity.createdAt = contactUs.createdAt;
    entity.updatedAt = contactUs.updatedAt;

    return entity;
  }

  private static mapUserReferenceToDomain(userEntity?: UserEntity): User {
    return UserMapper.mapUserReferenceToDomain(userEntity);
  }

  private static mapUserReferenceToPersistence(user?: User): UserEntity {
    return UserMapper.mapUserReferenceToPersistence(user);
  }

  private static mapCountryReferenceToDomain(countryEntity?: CountryEntity): Country {
    return CountryMapper.toDomain(countryEntity);
  }

  private static mapCountryReferenceToPersistence(country?: Partial<Country>): CountryEntity {
    return CountryMapper.toPersistence(country);
  }
}
