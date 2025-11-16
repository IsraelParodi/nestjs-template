import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListOfValuesController } from './presenters/http/lov.controller';
import { UsersModule } from '@users/users.module';
import { ListOfValuesRepository } from './application/ports/outbound/lov.repository';
import { ListOfValuesDetailRepository } from './application/ports/outbound/lov-detail.repository';
import { ListOfValuesDetailEntity } from './infrastructure/adapters/typeorm/entities/lov-detail.entity';
import { ListOfValuesEntity } from './infrastructure/adapters/typeorm/entities/lov.entity';
import { TypeOrmListOfValuesDetailRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-lov-detail.repository';
import { TypeOrmListOfValuesRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-lov.repository';
import { CreateLovDetailService } from './application/use-cases/create-lov-detail.service';
import { CreateLovService } from './application/use-cases/create-lov.service';
import { DeleteLovDetailService } from './application/use-cases/delete-lov-detail.service';
import { DeleteLovService } from './application/use-cases/delete-lov.service';
import { GetLovService } from './application/use-cases/get-lov.service';
import { ListLovService } from './application/use-cases/list-lov.service';
import { UpdateLovDetailService } from './application/use-cases/update-lov-detail.service';
import { UpdateLovService } from './application/use-cases/update-lov.service';
import { CreateLovDetailUseCase } from './application/ports/inbound/create-lov-detail.use-case';
import { CreateLovUseCase } from './application/ports/inbound/create-lov.use-case';
import { DeleteLovDetailUseCase } from './application/ports/inbound/delete-lov-detail.use-case';
import { DeleteLovUseCase } from './application/ports/inbound/delete-lov.use-case';
import { GetLovUseCase } from './application/ports/inbound/get-lov.use-case';
import { ListLovUseCase } from './application/ports/inbound/list-lov.use-case';
import { UpdateLovDetailUseCase } from './application/ports/inbound/update-lov-detail.use-case';
import { UpdateLovUseCase } from './application/ports/inbound/update-lov.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListOfValuesEntity, ListOfValuesDetailEntity]),
    UsersModule,
  ],
  controllers: [ListOfValuesController],
  providers: [
    {
      provide: CreateLovDetailUseCase,
      useClass: CreateLovDetailService,
    },
    {
      provide: CreateLovUseCase,
      useClass: CreateLovService,
    },
    {
      provide: DeleteLovDetailUseCase,
      useClass: DeleteLovDetailService,
    },
    {
      provide: DeleteLovUseCase,
      useClass: DeleteLovService,
    },
    {
      provide: GetLovUseCase,
      useClass: GetLovService,
    },
    {
      provide: ListLovUseCase,
      useClass: ListLovService,
    },
    {
      provide: UpdateLovDetailUseCase,
      useClass: UpdateLovDetailService,
    },
    {
      provide: UpdateLovUseCase,
      useClass: UpdateLovService,
    },
    {
      provide: ListOfValuesRepository,
      useClass: TypeOrmListOfValuesRepository,
    },
    {
      provide: ListOfValuesDetailRepository,
      useClass: TypeOrmListOfValuesDetailRepository,
    },
  ],
  exports: [
    CreateLovDetailUseCase,
    CreateLovUseCase,
    DeleteLovDetailUseCase,
    DeleteLovUseCase,
    GetLovUseCase,
    ListLovUseCase,
    UpdateLovDetailUseCase,
    UpdateLovUseCase,
    ListOfValuesRepository,
    ListOfValuesDetailRepository,
  ],
})
export class ListOfValuesModule {}
