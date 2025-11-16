import { Module } from '@nestjs/common';
import { ContactUsApplicationService } from './application/services/contact-us.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUsEntity } from './infrastructure/persistance/orm/entities/contact-us.entity';
import { ContactUsController } from './presenters/http/contact-us.controller';
import { ContactUsDomainService } from './domain/services/contact-us.service';
import { OrmContactUsRepository } from './infrastructure/persistance/orm/repositories/orm-contact-us.repository';
import { UsersModule } from '@users/users.module';
import { LocalitiesModule } from '@localities/localities.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { ContactUsRepository } from './domain/repositories/contact-us.repository';
import { NotificationsModule } from '@notifications/notifications.module';

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
    ContactUsApplicationService,
    ContactUsDomainService,
    {
      provide: ContactUsRepository,
      useClass: OrmContactUsRepository,
    },
  ],
  exports: [
    ContactUsApplicationService,
    ContactUsDomainService,
    ContactUsRepository,
  ],
})
export class ContactUsModule {}
