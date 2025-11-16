import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsEntity } from './infrastructure/persistance/orm/entities/quotations.entity';
import { QuotationsController } from './presenters/http/quotations.controller';
import { OrmQuotationsRepository } from './infrastructure/persistance/orm/repositories/orm-quotations.repository';
import { UsersModule } from '@users/users.module';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { QuotationsRepository } from './application/ports/outbound/quotations.repository';
import { CreateQuotationUseCase } from './application/ports/inbound/create-quotation.use-case';
import { CreateQuotationService } from './application/use-cases/create-quotation.service';
import { DeleteManyQuotationsUseCase } from './application/ports/inbound/delete-many-quotations.use-case';
import { DeleteManyQuotationService } from './application/use-cases/delete-many-quotations.service';
import { DeleteQuotationUseCase } from './application/ports/inbound/delete-quotation.use-case';
import { DeleteQuotationService } from './application/use-cases/delete-quotation.service';
import { GetQuotationUseCase } from './application/ports/inbound/get-quotation.use-case';
import { GetQuotationService } from './application/use-cases/get-quotation.service';
import { ListQuotationUseCase } from './application/ports/inbound/list-quotations.use-case';
import { ListQuotationsService } from './application/use-cases/list-quotations.service';
import { UpdateQuotationUseCase } from './application/ports/inbound/update-quotation.use-case';
import { UpdateQuotationsService } from './application/use-cases/update-quotation.service';
import { QuotationValidator } from './application/validators/quotation.validator';
import { CreateQuotationTransactionalUseCase } from './application/ports/inbound/create-quotation-transactional.use-case';
import { CreateQuotationTransactionalService } from './application/use-cases/create-quotation-transactional.service';
import { UnitOfWorkPort } from '../common/application/ports/outbound/unit-of-work.port';
import { TypeormUnitOfWork } from '@common/infrastructure/persistance/typeorm/typeorm-unit-of-work';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationsEntity]),
    UsersModule,
    LocalitiesModule,
    ListOfValuesModule,
    NotificationsModule,
  ],
  controllers: [QuotationsController],
  providers: [
    {
      provide: CreateQuotationUseCase,
      useClass: CreateQuotationService,
    },
    {
      provide: CreateQuotationTransactionalUseCase,
      useClass: CreateQuotationTransactionalService,
    },
    {
      provide: DeleteManyQuotationsUseCase,
      useClass: DeleteManyQuotationService,
    },
    {
      provide: DeleteQuotationUseCase,
      useClass: DeleteQuotationService,
    },
    {
      provide: GetQuotationUseCase,
      useClass: GetQuotationService,
    },
    {
      provide: ListQuotationUseCase,
      useClass: ListQuotationsService,
    },
    {
      provide: UpdateQuotationUseCase,
      useClass: UpdateQuotationsService,
    },
    {
      provide: QuotationsRepository,
      useClass: OrmQuotationsRepository,
    },
    {
      provide: UnitOfWorkPort,
      useClass: TypeormUnitOfWork,
    },
    QuotationValidator,
  ],
  exports: [
    CreateQuotationUseCase,
    CreateQuotationTransactionalUseCase,
    DeleteManyQuotationsUseCase,
    DeleteQuotationUseCase,
    GetQuotationUseCase,
    ListQuotationUseCase,
    UpdateQuotationUseCase,
    QuotationsRepository,
  ],
})
export class QuotationsModule {}
