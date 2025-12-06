import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from '../tests.helper';
import * as request from 'supertest';

const expectedCountryShape = {
  id: expect.any(Number),
  name: expect.any(String),
  currency: expect.any(String),
  phoneCode: expect.any(String),
  emoji: expect.any(String),
};

const expectedQuotationShape = {
  id: expect.any(Number),
  name: expect.any(String),
  lastname: expect.any(String),
  email: expect.any(String),
  phone: expect.any(String),
  transportType: expect.any(String),
  industryType: expect.any(String),
  country: expect.objectContaining(expectedCountryShape),
};

function expectQuotationPayload(payload: any, dto?: any) {
  const expected = dto
    ? expect.objectContaining({
        ...dto,
        country: expect.objectContaining(expectedCountryShape),
        id: expect.any(Number),
      })
    : expectedQuotationShape;
  expect(payload).toMatchObject(expected);
}

describe('[Feature] - Quotations - /quotations', () => {
  describe('Quotations [POST /quotations]', () => {
    const quotationDto = {
      name: 'Israel',
      lastname: 'Parodi',
      userType: 'Persona Natural',
      email: 'israelps97@gmail.com',
      phoneCode: '+51',
      phone: '997599603',
      transportType: 'Transporte marítimo',
      industryType: 'Bebidas / Beverage',
      country: 140,
      documentType: 'DNI',
      documentNumber: '75507274',
      shippingType: 'FCL',
      containerCode: "20' ST",
      origin: 'PECLL',
      destination: 'PECLL',
    };

    it('should create a quotation', async () => {
      const response = await postRequest('/quotations', quotationDto);
      expectQuotationPayload(response.body.payload, quotationDto);
    });

    it('should create a quotation and return a LOV validation error', async () => {
      const customQuotationDto = { ...quotationDto, userType: 'Persona' };
      const response = await postRequest(
        '/quotations',
        { ...quotationDto, userType: 'Persona' },
        400,
      );
      expect(response.body.error).toEqual({
        message: `Don't exist a LOV Detail with name: ${customQuotationDto.userType} in LOV with key: user_type`,
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('should create a quotation without unit of work pattern', async () => {
      const response = await postRequest(
        '/quotations/create-without-transaction',
        quotationDto,
      );
      expectQuotationPayload(response.body.payload, quotationDto);
    });
  });

  describe('Quotations [PATCH /quotations/:id]', () => {
    const quotationsDto = {
      name: 'Israel',
      lastname: 'Parodi',
      email: 'ips@gmail.com',
      phone: '+51997599603',
      country: 143,
      transportType: 'Transporte terrestre',
      industryType: 'Bebidas / Beverage',
    };

    it('should update a quotation', async () => {
      const response = await patchRequest(
        '/quotations/1',
        quotationsDto,
        200,
        globalThis.accessToken,
      );
      expect(response.body.payload).toEqual(
        expect.objectContaining({
          id: 1,
          ...quotationsDto,
          country: expect.objectContaining(expectedCountryShape),
        }),
      );
    });
  });

  describe('Quotations [GET /quotations]', () => {
    it('should return a list of quotations', async () => {
      const response = await getRequest(
        '/quotations',
        200,
        globalThis.accessToken,
      );
      expect(response.body.payload.data).toHaveLength(2);
      expect(response.body.payload.total).toBe(2);
      expect(response.body.payload.totalPages).toBe(1);
      expectQuotationPayload(response.body.payload.data[0]);
    });

    it('should return a list of quotations with filters', async () => {
      const response = await request(globalThis.app.getHttpServer())
        .get('/quotations')
        .set('Authorization', `Bearer ${globalThis.accessToken}`)
        .query({ name: 'Israel', lastname: 'Parodi' })
        .expect(200);
      expect(response.body.payload.data).toHaveLength(2);
      expect(response.body.payload.total).toBe(2);
      expect(response.body.payload.totalPages).toBe(1);
      expectQuotationPayload(response.body.payload.data[0]);
    });
  });

  describe('Quotation by id [GET /quotations/:id]', () => {
    it('should return a quotation by id', async () => {
      const response = await getRequest(
        '/quotations/1',
        200,
        globalThis.accessToken,
      );
      expectQuotationPayload(response.body.payload);
    });

    it('should fail when quotation not found', async () => {
      const quotationsId = 9999;
      const response = await getRequest(
        `/quotations/${quotationsId}`,
        404,
        globalThis.accessToken,
      );
      expect(response.body.error).toEqual({
        message: `Quotations with ID ${quotationsId} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('Delete quotation by id [DELETE /quotations/:id]', () => {
    it('should delete a quotation by id', async () => {
      const response = await deleteRequest(
        '/quotations/1',
        200,
        globalThis.accessToken,
      );
      expect(response.body.payload).toEqual({
        generatedMaps: expect.any(Array),
        raw: expect.any(Array),
        affected: 1,
      });
    });

    it('should delete a quotation by an ids array', async () => {
      const quotationDto = {
        name: 'Israel',
        lastname: 'Parodi',
        userType: 'Persona Natural',
        email: 'israelps97@gmail.com',
        phoneCode: '+51',
        phone: '997599603',
        transportType: 'Transporte marítimo',
        industryType: 'Bebidas / Beverage',
        country: 140,
        documentType: 'DNI',
        documentNumber: '75507274',
        shippingType: 'FCL',
        containerCode: "20' ST",
        origin: 'PECLL',
        destination: 'PECLL',
      };

      const responseCreate = await postRequest('/quotations', quotationDto);
      const response = await postRequest(
        '/quotations/massive-delete',
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
