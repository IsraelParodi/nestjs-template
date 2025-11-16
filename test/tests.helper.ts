import * as request from 'supertest';
import { sign, type Secret, type SignOptions } from 'jsonwebtoken';

export function getRequest(path: string, expectedStatus = 200, auth = false) {
  const req = request(globalThis.app.getHttpServer()).get(path);
  if (auth) req.set('Authorization', `Bearer ${globalThis.accessToken}`);
  return req.expect(expectedStatus);
}

export function postRequest(
  path: string,
  body: any,
  expectedStatus = 201,
  auth = false,
) {
  const req = request(globalThis.app.getHttpServer()).post(path).send(body);
  if (auth) req.set('Authorization', `Bearer ${globalThis.accessToken}`);
  return req.expect(expectedStatus);
}

export function patchRequest(path: string, body: any, expectedStatus, auth) {
  const req = request(globalThis.app.getHttpServer()).patch(path).send(body);
  req.set('Authorization', `Bearer ${globalThis.accessToken}`);
  return req.expect(expectedStatus);
}

export function deleteRequest(path: string, expectedStatus, auth) {
  const req = request(globalThis.app.getHttpServer()).delete(path);
  req.set('Authorization', `Bearer ${globalThis.accessToken}`);
  return req.expect(expectedStatus);
}

export function postRequestCustomToken(
  path: string,
  body: any,
  expectedStatus,
  auth,
) {
  const req = request(globalThis.app.getHttpServer()).post(path).send(body);
  req.set('Authorization', `Bearer ${auth}`);
  return req.expect(expectedStatus);
}

export type TestJwtPayload = {
  email?: string;
  role?: {
    id: number;
    name: string;
  };
};

export function signTestToken(
  sub: number,
  expiresIn: SignOptions['expiresIn'] = '1h',
  payload: Record<string, any> = {},
): string {
  const secret = process.env.JWT_SECRET as Secret;

  const options: SignOptions = {
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    expiresIn,
  };

  return sign({ sub, ...payload }, secret, options);
}
