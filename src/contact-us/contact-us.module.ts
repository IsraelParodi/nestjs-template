import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUsEntity } from './infrastructure/adapters/orm/entities/contact-us.entity';
import { ContactUsController } from './presenters/http/contact-us.controller';
import { OrmContactUsRepository } from './infrastructure/adapters/orm/repositories/orm-contact-us.repository';
import { UsersModule } from '@users/users.module';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { CreateContactUsUseCase } from './application/ports/inbound/create-contact-us.use-case';
import { DeleteContactUsUseCase } from './application/ports/inbound/delete-contact-us.use-case';
import { DeleteManyContactUsUseCase } from './application/ports/inbound/delete-many-contact-us.use-case';
import { GetContactUsUseCase } from './application/ports/inbound/get-contact-us.use-case';
import { ListContactUsUseCase } from './application/ports/inbound/list-contact-us.use-case';
import { ContactUsRepository } from './application/ports/outbound/contact-us.repository';
import { CreateContactUsService } from './application/use-cases/create-contact-us.service';
import { DeleteContactUsService } from './application/use-cases/delete-contact-us.service';
import { DeleteManyContactUsService } from './application/use-cases/delete-many-contact-us.service';
import { GetContactUsService } from './application/use-cases/get-contact-us.service';
import { ListContactUsService } from './application/use-cases/list-contact-us.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactUsEntity]),
    UsersModule,
    LocalitiesModule,
    ListOfValuesModule,
    NotificationsModule,
  ],
  controllers: [ContactUsController],
  providers: [
    {
      provide: CreateContactUsUseCase,
      useClass: CreateContactUsService,
    },
    {
      provide: DeleteContactUsUseCase,
      useClass: DeleteContactUsService,
    },
    {
      provide: DeleteManyContactUsUseCase,
      useClass: DeleteManyContactUsService,
    },
    {
      provide: GetContactUsUseCase,
      useClass: GetContactUsService,
    },
    {
      provide: ListContactUsUseCase,
      useClass: ListContactUsService,
    },
    {
      provide: ContactUsRepository,
      useClass: OrmContactUsRepository,
    },
  ],
  exports: [
    CreateContactUsUseCase,
    DeleteContactUsUseCase,
    DeleteManyContactUsUseCase,
    GetContactUsUseCase,
    ListContactUsUseCase,
    ContactUsRepository,
  ],
})
export class ContactUsModule {}
