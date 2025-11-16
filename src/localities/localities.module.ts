import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './infrastructure/adapters/typeorm/entities/country.entity';
import { TypeOrmCountryRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-country.repository';
import { TypeOrmStateRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-state.repository';
import { StateEntity } from './infrastructure/adapters/typeorm/entities/states.entity';
import { LocalitiesController } from './presenters/http/localities.controller';
import { GetCountryService } from './application/use-cases/get-country.service';
import { ListCountriesService } from './application/use-cases/list-countries.service';
import { GetStateService } from './application/use-cases/get-state.service';
import { ListStatesByCountryService } from './application/use-cases/list-states-by-country.service';
import { CountryRepository } from './application/ports/outbound/country.repository';
import { StateRepository } from './application/ports/outbound/state.repository';
import { GetCountryUseCase } from './application/ports/inbound/get-country.use-case';
import { ListCountriesUseCase } from './application/ports/inbound/list-countries.use-case';
import { GetStateUseCase } from './application/ports/inbound/get-state.use-case';
import { ListStatesByCountryUseCase } from './application/ports/inbound/list-states-by-country.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, StateEntity])],
  controllers: [LocalitiesController],
  providers: [
    {
      provide: GetCountryUseCase,
      useClass: GetCountryService,
    },
    {
      provide: ListCountriesUseCase,
      useClass: ListCountriesService,
    },
    {
      provide: GetStateUseCase,
      useClass: GetStateService,
    },
    {
      provide: ListStatesByCountryUseCase,
      useClass: ListStatesByCountryService,
    },
    {
      provide: CountryRepository,
      useClass: TypeOrmCountryRepository,
    },
    {
      provide: StateRepository,
      useClass: TypeOrmStateRepository,
    },
  ],
  exports: [
    GetCountryUseCase,
    ListCountriesUseCase,
    GetStateUseCase,
    ListStatesByCountryUseCase,
    CountryRepository,
    StateRepository,
  ],
})
export class LocalitiesModule {}
