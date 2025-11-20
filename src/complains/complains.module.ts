import { Module } from '@nestjs/common';
import { ComplainsApplicationService } from './application/services/complains.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplainsEntity } from './infrastructure/persistance/orm/entities/complains.entity';
import { ComplainsController } from './presenters/http/complains.controller';
import { ComplainsDomainService } from './domain/services/complains.service';
import { OrmComplainsRepository } from './infrastructure/persistance/orm/repositories/orm-complains.repository';
import { UsersModule } from '@users/users.module';
import { ComplainsRepository } from './domain/repositories/complains.repository';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { NotificationsModule } from '@notifications/notifications.module';

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
    ComplainsApplicationService,
    ComplainsDomainService,
    {
      provide: ComplainsRepository,
      useClass: OrmComplainsRepository,
    },
  ],
  exports: [
    ComplainsApplicationService,
    ComplainsDomainService,
    ComplainsRepository,
  ],
})
export class ComplainsModule {}
