import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './../src/app.module';

dotenv.config();

describe('[Feature] - Users - /users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.todo('Create User [POST /]');
  it.todo('List Users [GET /]');
  it.todo('Get User [GET /:id]');
  it.todo('Update User [PATCH /:id]');
  it.todo('Delete User [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
