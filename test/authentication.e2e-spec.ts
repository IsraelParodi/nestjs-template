import * as request from 'supertest';

describe('[Feature] - Authentication - /authentication', () => {
  let accessToken: string;
  let refreshToken: string;
  let forgetToken: string;
  const password = process.env.PASSWORD_TEST
  const passwordWrong = process.env.PASSWORD_TEST + '0'

  describe('Sign Up [POST /authentication/sign-up]', () => {
    it('should sign up successfully', async () => {
      const signUpDto = {
        email: 'israel.parodisch@gmail.com',
        password: password,
        name: 'Israel',
        lastname: 'Parodi',
        businessTaxId: '2010505050',
        legalName: 'Melvan Peru',
        country: 173,
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto)
        .expect(201);

      expect(response.body.payload).toMatchObject({
        message: 'User created successfully',
        id: expect.any(Number)
      });
    });

    it('should conflict when sign up', async () => {
      const signUpDto = {
        email: 'israel.parodisch@gmail.com',
        password: password,
        name: 'Israel',
        lastname: 'Parodi',
        businessTaxId: '2010505050',
        legalName: 'Melvan Peru',
        country: 173,
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto)
        .expect(409);

      expect(response.body.error).toMatchObject({
        statusCode: 409,
        message: 'Conflict',
      });
    });
  });

  describe('Sign In [POST /authentication/sign-in]', () => {
    it('should sign in successfully', async () => {
      const signInDto = {
        email: 'israel.parodisch@gmail.com',
        password: password,
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/sign-in')
        .send(signInDto)
        .expect(200);

      accessToken = response.body.payload.accessToken;
      refreshToken = response.body.payload.refreshToken;

      expect(response.body.payload).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should fail while sign in', async () => {
      const refreshTokenDto = {
        email: 'israel.parodisch@gmail.com',
        password: passwordWrong,
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/sign-in')
        .send(refreshTokenDto)
        .expect(401);

      expect(response.body.error).toMatchObject({
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

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/refresh-tokens')
        .send(signInDto)
        .expect(200);

      expect(response.body.payload).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should fail while refresh the token', async () => {
      const refreshTokenDto = {
        refreshToken: 'refreshToken',
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/refresh-tokens')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(refreshTokenDto)
        .expect(401);

      expect(response.body.error).toMatchObject({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('Forgot password [POST /authentication/forgot-password]', () => {
    it('should send email and retrieve token successfully', async () => {
      const forgetPasswordDto = {
        email: "israel.parodisch@gmail.com",
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/forgot-password')
        .send(forgetPasswordDto)
        .expect(201);

      forgetToken = response.body.payload.token;

      expect(response.body.payload).toMatchObject({
        token: expect.any(String),
      });
    });

    it('should fail when send an invalid email', async () => {
      const forgetPasswordDto = {
        email: "israel@gmail.com",
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/forgot-password')
        .send(forgetPasswordDto)
        .expect(404);

      const details = Object.entries(forgetPasswordDto)
        .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join(', ');

      expect(response.body.error).toMatchObject({
        message: `User with ${details} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('Reset password [POST /authentication/reset-password]', () => {
    it('should reset password successfully', async () => {
      const resetPasswordDto = {
        token: forgetToken,
        password: password
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/reset-password')
        .send(resetPasswordDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(response.body).toMatchObject({
        succeeded: true,
        message: "Request successful",
        timestamp: expect.any(String),
        errors: expect.any(Array),
        path: '/authentication/reset-password'
      });
    });

    it('should fail when send an invalid email', async () => {
      const resetPasswordDto = {
        token: "forgetToken",
        password: password
      };

      const response = await request(globalThis.app.getHttpServer())
        .post('/authentication/reset-password')
        .send(resetPasswordDto)
        .expect(400);

      expect(response.body.error).toMatchObject({
        message: `Invalid or expired token`,
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });
});
