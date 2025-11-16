import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplainsEntity } from './infrastructure/persistance/typeorm/entities/complains.entity';
import { ComplainsController } from './presenters/http/complains.controller';
import { TypeOrmComplainsRepository } from './infrastructure/persistance/typeorm/repositories/typeorm-complains.repository';
import { UsersModule } from '@users/users.module';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { ComplainsRepository } from './application/ports/outbound/complains.repository';
import { CreateComplainUseCase } from './application/ports/inbound/create-complain.use-case';
import { CreateComplainService } from './application/use-cases/create-complain.service';
import { DeleteComplainUseCase } from './application/ports/inbound/delete-complain.use-case';
import { DeleteComplainService } from './application/use-cases/delete-complain.service';
import { GetComplainUseCase } from './application/ports/inbound/get-complain.use-case';
import { GetComplainService } from './application/use-cases/get-complain.service';
import { ListComplainsUseCase } from './application/ports/inbound/list-complains.use-case';
import { ListComplainService } from './application/use-cases/list-complains.service';
import { UpdateComplainUseCase } from './application/ports/inbound/update-complain.use-case';
import { UpdateComplainService } from './application/use-cases/update-complain.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplainsEntity]),
    UsersModule,
    LocalitiesModule,
    ListOfValuesModule,
    NotificationsModule,
  ],
  controllers: [ComplainsController],
  providers: [
    {
      provide: ComplainsRepository,
      useClass: TypeOrmComplainsRepository,
    },
    {
      provide: CreateComplainUseCase,
      useClass: CreateComplainService,
    },
    {
      provide: DeleteComplainUseCase,
      useClass: DeleteComplainService,
    },
    {
      provide: GetComplainUseCase,
      useClass: GetComplainService,
    },
    {
      provide: ListComplainsUseCase,
      useClass: ListComplainService,
    },
    {
      provide: UpdateComplainUseCase,
      useClass: UpdateComplainService,
    },
  ],
  exports: [ComplainsRepository],
})
export class ComplainsModule {}
