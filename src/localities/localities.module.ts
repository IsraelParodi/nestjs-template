import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './infrastructure/persistance/orm/entities/country.entity';
import { CountriesApplicationService } from './application/services/countries.service';
import { CountriesDomainService } from './domain/services/countries.service';
import { CountryRepository } from './domain/repositories/country.repository';
import { OrmCountryRepository } from './infrastructure/persistance/orm/repositories/orm-country.repository';
import { StateRepository } from './domain/repositories/state.repository';
import { StatesDomainService } from './domain/services/states.service';
import { OrmStateRepository } from './infrastructure/persistance/orm/repositories/orm-state.repository';
import { StateEntity } from './infrastructure/persistance/orm/entities/states.entity';
import { StatesApplicationService } from './application/services/states.service';
import { LocalitiesController } from './presenters/http/localities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, StateEntity])],
  controllers: [LocalitiesController],
  providers: [
    CountriesApplicationService,
    CountriesDomainService,
    {
      provide: CountryRepository,
      useClass: OrmCountryRepository,
    },
    StatesApplicationService,
    StatesDomainService,
    {
      provide: StateRepository,
      useClass: OrmStateRepository,
    },
  ],
  exports: [
    CountriesApplicationService,
    CountriesDomainService,
    CountryRepository,
    StatesApplicationService,
    StatesDomainService,
    StateRepository,
  ],
})
export class LocalitiesModule {}
