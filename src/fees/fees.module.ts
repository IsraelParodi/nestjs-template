import { Module } from '@nestjs/common';
import { FeesApplicationService } from './application/services/fees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeEntity } from './infrastructure/persistance/orm/entities/fee.entity';
import { FeesController } from './presenters/http/fees.controller';
import { FeesDomainService } from './domain/services/fees.service';
import { UsersModule } from '@users/users.module';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { FeesRepository } from './domain/repositories/fees.repository';
import { ContainerEntity } from './infrastructure/persistance/orm/entities/container.entity';
import { ExpenseEntity } from './infrastructure/persistance/orm/entities/expense.entity';
import { OrmFeesRepository } from './infrastructure/persistance/orm/repositories/orm-fees.repository';
import { SeaPortsModule } from '../sea-ports/sea-ports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeeEntity, ContainerEntity, ExpenseEntity]),
    UsersModule,
    LocalitiesModule,
    ListOfValuesModule,
    SeaPortsModule,
  ],
  controllers: [FeesController],
  providers: [
    FeesApplicationService,
    FeesDomainService,
    {
      provide: FeesRepository,
      useClass: OrmFeesRepository,
    },
  ],
  exports: [FeesApplicationService, FeesDomainService, FeesRepository],
})
export class FeesModule {}
