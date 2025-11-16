import { Module } from '@nestjs/common';
import { QuotationsApplicationService } from './application/services/quotations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsEntity } from './infrastructure/persistance/orm/entities/quotations.entity';
import { QuotationsController } from './presenters/http/quotations.controller';
import { QuotationsDomainService } from './domain/services/quotations.service';
import { OrmQuotationsRepository } from './infrastructure/persistance/orm/repositories/orm-quotations.repository';
import { UsersModule } from '@users/users.module';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { QuotationsRepository } from './domain/repositories/quotations.repository';
import { NotificationsModule } from '@notifications/notifications.module';
import { SeaPortsModule } from '@sea-ports/sea-ports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationsEntity]),
    UsersModule,
    LocalitiesModule,
    ListOfValuesModule,
    NotificationsModule,
    SeaPortsModule,
  ],
  controllers: [QuotationsController],
  providers: [
    QuotationsApplicationService,
    QuotationsDomainService,
    {
      provide: QuotationsRepository,
      useClass: OrmQuotationsRepository,
    },
  ],
  exports: [QuotationsApplicationService, QuotationsDomainService, QuotationsRepository],
})
export class QuotationsModule {}
