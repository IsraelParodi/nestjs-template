import { deleteRequest, getRequest, patchRequest, postRequest } from "./tests.helper";

const BASE_URL = '/complains';

const baseComplainDto = {
  documentType: 1,
  documentNumber: '12345678',
  complainerName: 'complainerName - prueba',
  complainerAddress: 'complainerAddress - prueba',
  complainerDistrict: 'complainerDistrict - prueba',
  complainerPhone: '987654321',
  complainerPhoneCode: '+51',
  complainerEmail: 'israelps97@gmail.com',
  complainerState: 15,
  complainerCountry: 170,
  nationalTaxpayerRegistry: '20123456789',
  companyName: 'Empresa SAC',
  serviceType: 5,
  currency: 7,
  amountComplained: 1000,
  description: 'description - prueba',
  type: 11,
  detail: 'detail - prueba',
  request: 'request - prueba',
  emailsCopied: ['prueba@email.com', 'prueba2@email.com'],
  createdBy: 1,
};

function expectComplainShape(payload: any) {
  expect(payload).toMatchObject({
    id: expect.any(Number),
    code: expect.stringMatching(/^B-\d{8}$/),
    status: expect.any(String),
    complainerName: expect.any(String),
    complainerAddress: expect.any(String),
    complainerDistrict: expect.any(String),
    complainerPhone: expect.any(String),
    complainerEmail: expect.any(String),
    nationalTaxpayerRegistry: expect.any(String),
    companyName: expect.any(String),
    amountComplained: expect.any(String),
    description: expect.any(String),
    detail: expect.any(String),
    request: expect.any(String),
    emailsCopied: expect.any(Array<string>),
    currency: expect.any(String),
  });
}

describe('[Feature] - Complains - /complains', () => {
  describe('Complains [POST /complains]', () => {
    it('should create a complain', async () => {
      const response = await postRequest(BASE_URL, baseComplainDto);
      expectComplainShape(response.body.payload);
      expect(response.body.payload.complainerCountry).toMatchObject({ id: baseComplainDto.complainerCountry, name: expect.any(String) });
      expect(response.body.payload.complainerState).toMatchObject({ id: baseComplainDto.complainerState, name: expect.any(String) });
    });

    it('should validate the national tax payer registry', async () => {
      const invalidDto = { ...baseComplainDto, nationalTaxpayerRegistry: '523324' };
      const response = await postRequest(BASE_URL, invalidDto, 400);
      expect(response.body.error).toEqual({
        message: ['The National Taxpayer Registry must start with 10 or 20 and have 11 as length'],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('should validate the document number length', async () => {
      const invalidDto = { ...baseComplainDto, documentNumber: '123456789999' };
      const response = await postRequest(BASE_URL, invalidDto, 400);
      expect(response.body.error).toEqual({
        message: `documentNumber must contain only numbers and have 8 digits for documentType "DNI".`,
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });

  describe('Complains [PATCH /complains/:id]', () => {
    it('should update a complain', async () => {
      const response = await patchRequest(`${BASE_URL}/1`, { currency: 8 }, 200, true);
      expect(response.body.payload).toMatchObject({
        id: expect.any(Number),
        code: expect.stringMatching(/^B-\d{8}$/),
        status: 'PENDING',
        currency: 8,
      });
    });
  });

  describe('Complains [GET /complains]', () => {
    it('should return a list of complains', async () => {
      const response = await getRequest(BASE_URL, 200, true);
      expect(response.body.payload.data).toHaveLength(1);
      expect(response.body.payload.total).toBe(1);
      expect(response.body.payload.totalPages).toBe(1);
      expectComplainShape(response.body.payload.data[0]);
    });
  });

  describe('Complain by id [GET /complains/:id]', () => {
    it('should return a complain by id', async () => {
      const response = await getRequest(`${BASE_URL}/1`, 200, true);
      expectComplainShape(response.body.payload);
      expect(response.body.payload.complainerState).toMatchObject({ id: expect.any(Number), name: expect.any(String) });
      expect(response.body.payload.complainerCountry).toMatchObject({ name: expect.any(String), iso2: expect.any(String) });
    });

    it('should return error when complain not found', async () => {
      const complainId = 9999;
      const response = await getRequest(`${BASE_URL}/${complainId}`, 404, true);
      expect(response.body.error).toEqual({
        message: `Complains with ID ${complainId} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('Delete complain by id [DELETE /complains/:id]', () => {
    it('should delete a complain by id', async () => {
      const response = await deleteRequest(`${BASE_URL}/1`, 200, true);
      expect(response.body.payload).toEqual({
        generatedMaps: expect.any(Array),
        raw: expect.any(Array),
        affected: 1,
      });
    });
  });
});
