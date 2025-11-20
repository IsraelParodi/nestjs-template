import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import appConfig from './../app.config';
import * as Joi from '@hapi/joi';
import { IamModule } from './iam/iam.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ComplainsModule } from '@complains/complains.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ListOfValuesModule } from '@lov/lov.module';
import { LocalitiesModule } from './localities/localities.module';
import { QuotationsModule } from '@quotations/quotations.module';
import { ContactUsModule } from '@contact-us/contact-us.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000,
      },
    ]),
    UsersModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'postgres',
          host:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_HOST_TEST
              : process.env.DATABASE_HOST,
          port:
            process.env.NODE_ENV === 'test'
              ? +process.env.DATABASE_PORT_TEST
              : +process.env.DATABASE_PORT,
          username:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_USER_TEST
              : process.env.DATABASE_USER,
          password:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_PASSWORD_TEST
              : process.env.DATABASE_PASSWORD,
          database:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_NAME_TEST
              : process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: false,
          logging: true,
          ssl: ['PROD', 'STAGING'].includes(process.env.NODE_ENV || '')
            ? { ca: process.env.CA_CERT }
            : false,
        };
      },
    }),
    IamModule,
    CommonModule,
    NotificationsModule,
    ListOfValuesModule,
    LocalitiesModule,
    ComplainsModule,
    QuotationsModule,
    ContactUsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
