import { Module } from '@nestjs/common';
import { ListOfValuesApplicationService } from './application/services/lov.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListOfValuesEntity } from './infrastructure/persistance/orm/entities/lov.entity';
import { ListOfValuesController } from './presenters/http/lov.controller';
import { ListOfValuesDomainService } from './domain/services/lov.service';
import { OrmListOfValuesRepository } from './infrastructure/persistance/orm/repositories/orm-lov.repository';
import { UsersModule } from '@users/users.module';
import { ListOfValuesRepository } from './domain/repositories/lov.repository';
import { ListOfValuesDetailApplicationService } from './application/services/lov-detail.service';
import { OrmListOfValuesDetailRepository } from './infrastructure/persistance/orm/repositories/orm-lov-detail.repository';
import { ListOfValuesDetailRepository } from './domain/repositories/lov-detail.repository';
import { ListOfValuesDetailDomainService } from './domain/services/lov-detail.service';
import { ListOfValuesDetailEntity } from './infrastructure/persistance/orm/entities/lov-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListOfValuesEntity, ListOfValuesDetailEntity]), UsersModule],
  controllers: [ListOfValuesController],
  providers: [
    ListOfValuesApplicationService,
    ListOfValuesDomainService,
    {
      provide: ListOfValuesRepository,
      useClass: OrmListOfValuesRepository,
    },
    ListOfValuesDetailApplicationService,
    ListOfValuesDetailDomainService,
    {
      provide: ListOfValuesDetailRepository,
      useClass: OrmListOfValuesDetailRepository,
    },
  ],
  exports: [
    ListOfValuesApplicationService,
    ListOfValuesDomainService,
    ListOfValuesRepository,
    ListOfValuesDetailApplicationService,
    ListOfValuesDetailDomainService,
    ListOfValuesDetailRepository,
  ],
})
export class ListOfValuesModule {}
