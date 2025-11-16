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
import { GlobalExceptionFilter } from '@common/infrastructure/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

const envMap: Record<string, string> = {
  TEST: '.env.test',
  PROD: '.env.production',
  DEV: '.env.development',
};

const envFilePath = envMap[process.env.APP_ENV];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        APP_ENV: Joi.string().valid('TEST', 'DEV', 'PROD').required(),

        JWT_SECRET: Joi.string().min(10).required(),
        JWT_TOKEN_AUDIENCE: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().integer().positive().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.number().integer().positive().required(),

        DB_TYPE: Joi.string().valid('postgres').required(),
        DATABASE_HOST: Joi.string().hostname().required(),
        DATABASE_PORT: Joi.number().port().default(5432),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

        POSTGRES_USER: Joi.string().optional(),
        POSTGRES_PASSWORD: Joi.string().optional(),
        POSTGRES_DB: Joi.string().optional(),

        SENDGRID_API_KEY: Joi.string().required(),
        SENDGRID_API_SENDER: Joi.string().email().required(),

        TWILIO_API_ACCOUNT_SID: Joi.string().required(),
        TWILIO_API_TOKEN: Joi.string().required(),
        TWILIO_API_SENDER: Joi.string().required(),

        LOCAL_BO_FRONTEND_URL: Joi.string().uri().required(),
        DEV_BO_FRONTEND_URL: Joi.string().uri().required(),
        PROD_BO_FRONTEND_URL: Joi.string().uri().required(),

        API_KEY: Joi.string().optional(),
      }),
      envFilePath: envFilePath,
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
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: false,
          logging: ['STAGING', 'DEV'].includes(process.env.APP_ENV),
          ssl: ['PROD', 'STAGING'].includes(process.env.APP_ENV)
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
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
