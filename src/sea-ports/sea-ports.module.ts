import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeaPortsApplicationService } from './application/services/sea-ports.service';
import { SeaPortsDomainService } from './domain/services/sea-ports.service';
import { SeaPortsController } from './presenters/http/sea-ports.controller';
import { SeaPortsRepository } from './domain/repositories/sea-ports.repository';
import { SeaPortEntity } from './infrastructure/persistance/orm/entities/sea-port.entity';
import { OrmSeaPortsRepository } from './infrastructure/persistance/orm/repositories/orm-sea-ports.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SeaPortEntity])],
  controllers: [SeaPortsController],
  providers: [
    SeaPortsApplicationService,
    SeaPortsDomainService,
    {
      provide: SeaPortsRepository,
      useClass: OrmSeaPortsRepository,
    },
  ],
  exports: [SeaPortsApplicationService, SeaPortsDomainService, SeaPortsRepository],
})
export class SeaPortsModule {}
