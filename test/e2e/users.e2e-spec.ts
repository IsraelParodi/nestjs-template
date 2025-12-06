import { mockedSgMail, twilioMessagesCreateMock } from '../global-setup';
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  postRequestCustomToken,
} from '../tests.helper';
import * as request from 'supertest';

const expectedCountryShape = {
  id: expect.any(Number),
  name: expect.any(String),
  currency: expect.any(String),
  phoneCode: expect.any(String),
  emoji: expect.any(String),
};

const expectedRoleShape = {
  id: expect.any(Number),
  name: expect.any(String),
};

const userDto = {
  email: 'parodi@gmail.com',
  password: process.env.PASSWORD_TEST,
  name: 'Israel',
  lastname: 'Parodi',
  businessTaxId: '2010505051',
  legalName: 'Israel Parodi',
  phoneCode: '+51',
  phone: '997778887',
  country: 173,
  role: 2,
};

let userId;

function expectedUserShape(payload: any) {
  expect(payload).toMatchObject({
    email: expect.any(String),
    country: expect.objectContaining(expectedCountryShape),
    role: expect.objectContaining(expectedRoleShape),
    createdAt: expect.any(String),
    createdBy: expect.any(Object),
  });
}

describe('[Feature] - Users - /users', () => {
  describe('Users [POST /users]', () => {
    it('should create a user', async () => {
      const response = await postRequest('/users', userDto, 201, true);
      userId = response.body.payload.id;
      expectedUserShape(response.body.payload);
    });

    it('should create a user but fail whend send the email', async () => {
      mockedSgMail.send.mockRejectedValueOnce(new Error('SendGrid exploded'));

      const response = await postRequest(
        '/users',
        { ...userDto, email: 'hola@gmail.com' },
        500,
        true,
      );

      expect(response.body.error).toEqual({
        message: `Cannot send email to hola@gmail.com`,
        error: 'Internal Server Error',
        statusCode: 500,
      });
    });

    it('should create a user but fail whend send the sms', async () => {
      twilioMessagesCreateMock.mockRejectedValueOnce(new Error('Twilio error'));

      const response = await postRequest(
        '/users',
        { ...userDto, email: 'hola1@gmail.com' },
        500,
        true,
      );

      expect(response.body.error).toEqual({
        message: `Cannot send sms to ${userDto.phone}`,
        error: 'Internal Server Error',
        statusCode: 500,
      });
    });

    it('should trigger the Unauthorized when create a user', async () => {
      const response = await postRequestCustomToken(
        '/users',
        userDto,
        401,
        'test',
      );
      expect(response.body.error).toEqual({
        message: `Unauthorized`,
        statusCode: 401,
      });
      expect(mockedSgMail.send).toHaveBeenCalled();
    });
  });

  describe('Users [PATCH /users/:id]', () => {
    const updateUserDto = {
      ...userDto,
      name: 'Pedro',
      role: 2,
    };

    it('should update a user', async () => {
      const response = await patchRequest(
        `/users/${userId}`,
        updateUserDto,
        200,
        globalThis.accessToken,
      );
      expectedUserShape({ ...response.body.payload, id: userId });
    });

    it('should get a message about roles when update a user', async () => {
      const responseLogin = await request(globalThis.app.getHttpServer())
        .post('/authentication/sign-in')
        .send({
          email: 'parodi@gmail.com',
          password: process.env.PASSWORD_TEST,
        });

      const response = await postRequestCustomToken(
        '/users',
        userDto,
        403,
        responseLogin.body.payload.accessToken,
      );

      expect(response.body.error).toEqual({
        message: `No cuenta con permisos para acceder`,
        error: 'Forbidden',
        statusCode: 403,
      });
    });
  });

  describe('Users [GET /users]', () => {
    it('should return a list of users', async () => {
      const response = await getRequest('/users', 200, globalThis.accessToken);
      expect(response.body.payload.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.payload.total).toBeGreaterThanOrEqual(2);
      expect(response.body.payload.totalPages).toBe(1);
      expectedUserShape(response.body.payload.data[0]);
    });

    it('should return a list of users with filters', async () => {
      const response = await request(globalThis.app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${globalThis.accessToken}`)
        .query({
          name: 'Pedro',
          lastname: 'Parodi',
          role: 2,
          start: '0',
          limit: '10',
        })
        .expect(200);
      expect(response.body.payload.data).toHaveLength(1);
      expect(response.body.payload.total).toBe(1);
      expect(response.body.payload.totalPages).toBe(1);
      expectedUserShape(response.body.payload.data[0]);
    });
  });

  describe('User by id [GET /users/:id]', () => {
    it('should return a user by id', async () => {
      const response = await getRequest(
        `/users/${userId}`,
        200,
        globalThis.accessToken,
      );
      expectedUserShape(response.body.payload);
    });

    it('should fail when user not found', async () => {
      const usersId = 9999;
      const response = await getRequest(
        `/users/${usersId}`,
        404,
        globalThis.accessToken,
      );
      expect(response.body.error).toEqual({
        message: `User with id=${usersId} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('Delete user by id [DELETE /users/:id]', () => {
    it('should delete a user by id', async () => {
      const response = await deleteRequest(
        `/users/${userId}`,
        200,
        globalThis.accessToken,
      );
      expect(response.body.payload).toEqual({
        generatedMaps: expect.any(Array),
        raw: expect.any(Array),
        affected: 1,
      });
    });

    it('should delete a user by an ids array', async () => {
      const createUserDto = {
        ...userDto,
        email: 'prueba@gmail.com',
      };

      const responseCreate = await postRequest(
        '/users',
        createUserDto,
        201,
        true,
      );
      const response = await postRequest(
        '/users/massive-delete',
        { ids: [responseCreate.body.payload.id] },
        200,
        globalThis.accessToken,
      );
      expect(response.body.payload).toEqual({
        generatedMaps: expect.any(Array),
        raw: expect.any(Array),
        affected: 1,
      });
    });
  });
});
