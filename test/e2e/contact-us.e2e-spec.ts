import { deleteRequest, getRequest, postRequest } from '../tests.helper';
import * as request from 'supertest';

const BASE_URL = '/contact-us';

const baseContactUsDto = {
  name: 'Luis',
  lastname: 'Ramirez',
  email: 'israelps97@gmail.com',
  phoneCode: '+51',
  phone: '987654321',
  message:
    'Hola, estoy interesado en conocer más sobre sus servicios de transporte internacional.',
  acceptPrivacyPolicies: true,
  receiveAdditionalInformation: false,
  country: 173,
};

function expectContactUsListShape(response: any) {
  expect(response.body.payload.data).toHaveLength(2);
  expect(response.body.payload.total).toBe(2);
  expect(response.body.payload.totalPages).toBe(1);
}

function expectContactUsShape(payload: any) {
  expect(payload).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    lastname: expect.any(String),
    email: expect.any(String),
    phoneCode: expect.any(String),
    phone: expect.any(String),
    message: expect.any(String),
    acceptPrivacyPolicies: expect.any(Boolean),
    receiveAdditionalInformation: expect.any(Boolean),
    country: expect.any(Object),
  });
}

describe('[Feature] - Contact Us - /contact-us', () => {
  describe('Contact Us [POST /contact-us]', () => {
    it('should create a contact us form', async () => {
      const response = await postRequest(BASE_URL, baseContactUsDto);
      expectContactUsShape(response.body.payload);
      expect(response.body.payload.country).toMatchObject({
        id: baseContactUsDto.country,
        name: expect.any(String),
      });
    });

    it('should create a contact us form with createdBy', async () => {
      const response = await postRequest(BASE_URL, {
        ...baseContactUsDto,
        createdBy: 1,
      });
      expectContactUsShape(response.body.payload);
      expect(response.body.payload.country).toMatchObject({
        id: baseContactUsDto.country,
        name: expect.any(String),
      });
    });
  });

  describe('Contact Us [GET /contact-us]', () => {
    it('should return a list of contact-us', async () => {
      const response = await getRequest(BASE_URL, 200, true);
      expectContactUsListShape(response);
      expectContactUsShape(response.body.payload.data[0]);
    });

    it('should return a list of quotations with filters', async () => {
      const response = await request(globalThis.app.getHttpServer())
        .get('/contact-us')
        .set('Authorization', `Bearer ${globalThis.accessToken}`)
        .query({ name: 'Luis', lastname: 'Ramirez' })
        .expect(200);
      expectContactUsListShape(response);
      expectContactUsShape(response.body.payload.data[0]);
    });
  });

  describe('Contact Us by id [GET /contact-us/:id]', () => {
    it('should return a contact us form by id', async () => {
      const response = await getRequest(`${BASE_URL}/1`, 200, true);
      expectContactUsShape(response.body.payload);
      expect(response.body.payload.country).toMatchObject({
        name: expect.any(String),
      });
    });

    it('should return error when contact us form not found', async () => {
      const contactUsId = 9999;
      const response = await getRequest(
        `${BASE_URL}/${contactUsId}`,
        404,
        true,
      );
      expect(response.body.error).toEqual({
        message: `ContactUs with ID ${contactUsId} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('Delete contact us form by id [DELETE /contact-us/:id]', () => {
    it('should delete a contact us form by id', async () => {
      const response = await deleteRequest(`${BASE_URL}/1`, 200, true);
      expect(response.body.payload).toEqual({
        generatedMaps: expect.any(Array),
        raw: expect.any(Array),
        affected: 1,
      });
    });

    it('should delete a contact us form by an ids array', async () => {
      const responseCreate = await postRequest('/contact-us', baseContactUsDto);
      const response = await postRequest(
        '/contact-us/massive-delete',
        { ids: [responseCreate.body.payload.id] },
        200,
        true,
      );
      expect(response.body.payload).toEqual({
        generatedMaps: expect.any(Array),
        raw: expect.any(Array),
        affected: 1,
      });
    });
  });
});
