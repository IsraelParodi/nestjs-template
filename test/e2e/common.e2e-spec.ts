import { getRequest } from '../tests.helper';

function expectedUserShape(payload: any) {
  expect(payload).toMatchObject({
    email: expect.any(String),
    createdAt: expect.any(String),
    createdBy: expect.any(Object),
  });
}

describe('[Feature] - Common - /common', () => {
  describe('Timeout interceptor [GET /slow]', () => {
    it('should timeout the API', async () => {
      const response = await getRequest(
        '/common/slow',
        408,
        globalThis.accessToken,
      );

      expect(response.body.error).toEqual({
        message: `Request Timeout`,
        statusCode: 408,
      });
    });
  });

  describe('Auth inspector [GET /common/auth-inspector]', () => {
    it('should return the auth inspector from all the controller', async () => {
      const response = await getRequest(
        '/common/auth-inspector',
        200,
        globalThis.accessToken,
      );

      expect(response.body.payload).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.any(String),
            categories: expect.any(Array),
            totalCount: expect.any(Number),
          }),
        ]),
      );
    });
  });

  describe('String error [GET /slow]', () => {
    it('should return an error object when the error message is a string', async () => {
      const response = await getRequest(
        '/common/string-error',
        400,
        globalThis.accessToken,
      );

      expect(response.body.error).toEqual({
        message: `Custom string error`,
      });
    });
  });
});
