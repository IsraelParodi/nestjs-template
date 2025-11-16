import { SeaPort } from '@sea-ports/domain/sea-port';
import { SeaPortEntity } from '../entities/sea-port.entity';
import { CountryMapper } from '@localities/infrastructure/persistance/orm/mappers/country.mapper';

export class SeaPortMapper {
  static toDomain(seaPortEntity: SeaPortEntity): SeaPort {
    const seaPort = new SeaPort(seaPortEntity.id);

    seaPort.iso2Country = seaPortEntity.iso2Country;
    seaPort.location = seaPortEntity.location;
    seaPort.unlocode = `${seaPort.iso2Country}${seaPort.location}`;
    seaPort.name = seaPortEntity.name;

    if (seaPortEntity.country) {
      const countryData = CountryMapper.toDomain(seaPortEntity.country);
      seaPort.country = {
        id: countryData?.id,
        name: countryData?.name,
        currency: countryData?.currency,
        phoneCode: countryData?.phoneCode,
        emoji: countryData?.emoji,
      };
    }

    return seaPort;
  }

  static toPersistence(seaPort: Partial<SeaPort>): SeaPortEntity {
    const seaPortEntity = new SeaPortEntity();

    seaPortEntity.id = seaPort.id;
    seaPortEntity.iso2Country = seaPort.iso2Country;
    seaPortEntity.location = seaPort.location;
    seaPortEntity.name = seaPort.name;

    return seaPortEntity;
  }
}
