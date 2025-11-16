import { Module } from '@nestjs/common';
import { TrackingsApplicationService } from './application/services/trackings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingEntity } from './infrastructure/persistance/orm/entities/tracking.entity';
import { TrackingsController } from './presenters/http/trackings.controller';
import { TrackingsDomainService } from './domain/services/trackings.service';
import { UsersModule } from '@users/users.module';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { TrackingsRepository } from './domain/repositories/trackings.repository';
import { ContainerEntity } from './infrastructure/persistance/orm/entities/container.entity';
import { SealEntity } from './infrastructure/persistance/orm/entities/seal.entity';
import { OrmTrackingsRepository } from './infrastructure/persistance/orm/repositories/orm-trackings.repository';
import { SeaPortsModule } from '../sea-ports/sea-ports.module';
import { NotificationsModule } from '@notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackingEntity, ContainerEntity, SealEntity]),
    UsersModule,
    LocalitiesModule,
    ListOfValuesModule,
    SeaPortsModule,
    NotificationsModule,
  ],
  controllers: [TrackingsController],
  providers: [
    TrackingsApplicationService,
    TrackingsDomainService,
    {
      provide: TrackingsRepository,
      useClass: OrmTrackingsRepository,
    },
  ],
  exports: [TrackingsApplicationService, TrackingsDomainService, TrackingsRepository],
})
export class TrackingsModule {}
