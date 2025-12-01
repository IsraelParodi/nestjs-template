
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { WrapResponseInterceptor } from '@common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from '@common/interceptors/timeout.interceptor';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';

beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    globalThis.app = moduleFixture.createNestApplication();

    globalThis.app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    globalThis.app.useGlobalFilters(new HttpExceptionFilter());
    globalThis.app.useGlobalInterceptors(
        new WrapResponseInterceptor(),
        new TimeoutInterceptor(),
    );

    await globalThis.app.init();

    const signUpDto = {
        email: 'admin@gmail.com',
        password: process.env.PASSWORD_TEST,
        name: 'admin',
        lastname: 'admin',
        businessTaxId: '2010505050',
        legalName: 'admin',
        country: 173,
    };

    await request(globalThis.app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto)

    await request(globalThis.app.getHttpServer())
        .patch(`/users/1`)
        .send({ role: 1 })

    const responseLogin = await request(globalThis.app.getHttpServer())
        .post('/authentication/sign-in')
        .send({
            email: 'admin@gmail.com',
            password: process.env.PASSWORD_TEST,
        })

    globalThis.accessToken = responseLogin.body.payload.accessToken
    globalThis.refreshToken = responseLogin.body.payload.refreshToken
});

afterAll(async () => {
    const dataSource = globalThis.app.get(DataSource);
    await dataSource.destroy();
    await globalThis.app.close();
});
