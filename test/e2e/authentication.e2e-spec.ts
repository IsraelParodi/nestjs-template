import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { postRequest } from '../tests.helper';

const password = process.env.PASSWORD_TEST;
const passwordWrong = `${process.env.PASSWORD_TEST}0`;

let accessToken: string;
let refreshToken: string;
let forgetToken: string;

const signUpDto = {
  email: 'israel.parodisch@gmail.com',
  password,
  name: 'Israel',
  lastname: 'Parodi',
  businessTaxId: '2010505050',
  legalName: 'Melvan Peru',
  country: 173,
};

const signInDto = {
  email: signUpDto.email,
  password,
};

function expectedTokensShape(payload: any) {
  expect(payload).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
  });
}

function expectedBaseResponseShape(body: any, path: string) {
  expect(body).toMatchObject({
    succeeded: true,
    message: 'Request successful',
    timestamp: expect.any(String),
    errors: expect.any(Array),
    path,
  });
}

async function signRefreshToken(
  payload: Record<string, any>,
  overrides: Partial<Parameters<JwtService['signAsync']>[1]> = {},
) {
  const jwtService = globalThis.app.get(JwtService);

  return jwtService.signAsync(payload, {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    expiresIn: '15m',
    ...overrides,
  });
}

describe('[Feature] - Authentication - /authentication', () => {
  describe('Sign Up [POST /authentication/sign-up]', () => {
    it('should sign up successfully', async () => {
      const response = await postRequest(
        '/authentication/sign-up',
        signUpDto,
        201,
      );

      expect(response.body.payload).toMatchObject({
        message: 'User created successfully',
        id: expect.any(Number),
      });
    });

    it('should conflict when sign up', async () => {
      const response = await postRequest(
        '/authentication/sign-up',
        signUpDto,
        409,
      );

      expect(response.body.error).toMatchObject({
        statusCode: 409,
        message: 'Conflict',
      });
    });
  });

  describe('Sign In [POST /authentication/sign-in]', () => {
    it('should sign in successfully', async () => {
      const response = await postRequest(
        '/authentication/sign-in',
        signInDto,
        200,
      );

      accessToken = response.body.payload.accessToken;
      refreshToken = response.body.payload.refreshToken;

      expectedTokensShape(response.body.payload);
    });

    it('should fail while sign in', async () => {
      const response = await postRequest(
        '/authentication/sign-in',
        {
          ...signInDto,
          password: passwordWrong,
        },
        401,
      );

      expect(response.body.error).toMatchObject({
        message: 'Email or Password does not match',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('Refresh token [POST /authentication/refresh-tokens]', () => {
    it('should refresh the token successfully', async () => {
      const response = await postRequest(
        '/authentication/refresh-tokens',
        { refreshToken },
        200,
      );

      expectedTokensShape(response.body.payload);
    });

    it('should fail when refresh token is not in the DB', async () => {
      const refreshTokenId = randomUUID();

      const fakeRefreshToken = await signRefreshToken({
        sub: 1,
        refreshTokenId,
      });

      const response = await postRequest(
        '/authentication/refresh-tokens',
        { refreshToken: fakeRefreshToken },
        401,
        globalThis.accessToken,
      );

      expect(response.body.error).toMatchObject({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should fail when there is no token for user', async () => {
      const refreshTokenId = randomUUID();

      const fakeRefreshToken = await signRefreshToken(
        { refreshTokenId },
        { subject: String(9999) },
      );

      const response = await postRequest(
        '/authentication/refresh-tokens',
        { refreshToken: fakeRefreshToken },
        401,
      );

      expect(response.body.error).toMatchObject({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should fail while refresh the token', async () => {
      const response = await postRequest(
        '/authentication/refresh-tokens',
        { refreshToken: 'refreshToken' },
        401,
        globalThis.accessToken,
      );

      expect(response.body.error).toMatchObject({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('Forgot password [POST /authentication/forgot-password]', () => {
    const forgotPasswordDto = {
      email: signUpDto.email,
    };

    it('should send email and retrieve token successfully', async () => {
      const response = await postRequest(
        '/authentication/forgot-password',
        forgotPasswordDto,
        201,
      );

      forgetToken = response.body.payload.token;

      expect(response.body.payload).toMatchObject({
        token: expect.any(String),
      });
    });

    it('should use the current token in DB', async () => {
      const response = await postRequest(
        '/authentication/forgot-password',
        forgotPasswordDto,
        201,
      );

      forgetToken = response.body.payload.token;

      expect(response.body.payload).toMatchObject({
        token: expect.any(String),
      });
    });

    it('should fail when send an invalid email', async () => {
      const invalidDto = {
        email: 'israel@gmail.com',
      };

      const response = await postRequest(
        '/authentication/forgot-password',
        invalidDto,
        404,
      );

      const details = Object.entries(invalidDto)
        .map(
          ([key, value]) =>
            `${key}=${
              typeof value === 'object' ? JSON.stringify(value) : value
            }`,
        )
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
        password,
      };

      const response = await postRequest(
        '/authentication/reset-password',
        resetPasswordDto,
        201,
        true,
      );

      expectedBaseResponseShape(
        response.body,
        '/authentication/reset-password',
      );
    });

    it('should fail when send an invalid token', async () => {
      const resetPasswordDto = {
        token: 'forgetToken',
        password,
      };

      const response = await postRequest(
        '/authentication/reset-password',
        resetPasswordDto,
        400,
      );

      expect(response.body.error).toMatchObject({
        message: `Invalid or expired token`,
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });
});
