import { Country } from '@localities/domain/entities/country';
import { CountryEntity } from '../entities/country.entity';

export class CountryMapper {
  static toDomain(countryEntity: CountryEntity): Country {
    const country = new Country(countryEntity.id);

    country.name = countryEntity.name;
    country.iso3 = countryEntity.iso3;
    country.numericCode = countryEntity.numericCode;
    country.iso2 = countryEntity.iso2;
    country.phoneCode = countryEntity.phoneCode;
    country.capital = countryEntity.capital;
    country.currency = countryEntity.currency;
    country.currencyName = countryEntity.currencyName;
    country.currencySymbol = countryEntity.currencySymbol;
    country.tld = countryEntity.tld;
    country.native = countryEntity.native;
    country.region = countryEntity.region;
    country.regionId = countryEntity.regionId;
    country.subregion = countryEntity.subregion;
    country.subregionId = countryEntity.subregionId;
    country.nationality = countryEntity.nationality;
    country.timezones = countryEntity.timezones;
    country.translations = countryEntity.translations;
    country.latitude = countryEntity.latitude;
    country.longitude = countryEntity.longitude;
    country.emoji = countryEntity.emoji;
    country.emojiU = countryEntity.emojiU;
    country.createdAt = countryEntity.createdAt;
    country.updatedAt = countryEntity.updatedAt;
    country.flag = countryEntity.flag;
    country.wikiDataId = countryEntity.wikiDataId;

    return country;
  }

  static toPersistence(country: Partial<Country>): CountryEntity {
    const countryEntity = new CountryEntity();

    countryEntity.id = country.id;
    countryEntity.name = country.name;
    countryEntity.iso3 = country.iso3;
    countryEntity.numericCode = country.numericCode;
    countryEntity.iso2 = country.iso2;
    countryEntity.phoneCode = country.phoneCode;
    countryEntity.capital = country.capital;
    countryEntity.currency = country.currency;
    countryEntity.currencyName = country.currencyName;
    countryEntity.currencySymbol = country.currencySymbol;
    countryEntity.tld = country.tld;
    countryEntity.native = country.native;
    countryEntity.region = country.region;
    countryEntity.regionId = country.regionId;
    countryEntity.subregion = country.subregion;
    countryEntity.subregionId = country.subregionId;
    countryEntity.nationality = country.nationality;
    countryEntity.timezones = country.timezones;
    countryEntity.translations = country.translations;
    countryEntity.latitude = country.latitude;
    countryEntity.longitude = country.longitude;
    countryEntity.emoji = country.emoji;
    countryEntity.emojiU = country.emojiU;
    countryEntity.createdAt = country.createdAt;
    countryEntity.updatedAt = country.updatedAt;
    countryEntity.flag = country.flag;
    countryEntity.wikiDataId = country.wikiDataId;

    return countryEntity;
  }
}
