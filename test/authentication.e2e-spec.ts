import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('[Feature] - Authentication - /authentication', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Sign Up [POST /authentication/sign-up]', () => {
    it('should sign up successfully', async () => {
      const signUpDto = {
        email: 'israel.parodisch@gmail.com',
        password: '1234567890',
        name: 'Israel',
        lastname: 'Parodi',
        businessTaxId: '2010505050',
        legalName: 'Melvan Peru',
        country: 173,
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'User created successfully',
      });
    });

    it('should conflict when sign up', async () => {
      const signUpDto = {
        email: 'israel.parodisch@gmail.com',
        password: '1234567890',
        name: 'Israel',
        lastname: 'Parodi',
        businessTaxId: '2010505050',
        legalName: 'Melvan Peru',
        country: 173,
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto)
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: 'Conflict',
      });
    });
  });

  describe('Sign In [POST /authentication/sign-in]', () => {
    it('should sign in successfully', async () => {
      const signInDto = {
        email: 'israel.parodisch@gmail.com',
        password: '1234567890',
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/sign-in')
        .send(signInDto)
        .expect(200);

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should fail while sign in', async () => {
      const signInDto = {
        email: 'israel.parodisch@gmail.com',
        password: '123456789',
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/sign-in')
        .send(signInDto)
        .expect(401);

      expect(response.body).toMatchObject({
        message: 'Email or Password does not match',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('Refresh token [POST /authentication/refresh-tokens]', () => {
    it('should refresh the token successfully', async () => {
      const signInDto = {
        refreshToken: refreshToken,
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/refresh-tokens')
        .send(signInDto)
        .expect(200);

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should fail while refresh the token', async () => {
      const signInDto = {
        refreshToken: 'refreshToken',
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/refresh-tokens')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(signInDto)
        .expect(401);

      expect(response.body).toMatchObject({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
