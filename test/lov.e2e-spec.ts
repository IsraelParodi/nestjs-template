import { deleteRequest, getRequest, patchRequest, postRequest } from "./tests.helper";
import * as request from 'supertest';

const BASE_URL = '/lov';

const baseLovDto = {
  "key": "prueba",
  "description": "LOV de Prueba"
};

const baseLovDetailDto = {
  "name": "RUC",
  "detail": "Registro Único de Contribuyente"
};

function expectLovShape(payload: any) {
  expect(payload).toMatchObject({
    id: expect.any(Number),
    key: expect.any(String),
    description: expect.any(String),
  });
}

function expectLovDetailShape(payload: any) {
  expect(payload).toMatchObject({
    key: expect.objectContaining({
      id: expect.any(Number),
      key: expect.any(String)
    }),
    name: expect.any(String),
    detail: expect.any(String),
  });
}

describe('[Feature] - LOV - /lov', () => {
  let lovDetailId: number;

  describe('LOV [POST /lov]', () => {
    it('should create a lov', async () => {
      const response = await postRequest(BASE_URL, baseLovDto, 201, true);
      expectLovShape(response.body.payload);
    });

    it('should create a lov and return a validation error', async () => {
      const response = await postRequest(BASE_URL, baseLovDto, 400, true);
      expect(response.body.error).toEqual({
        message: `The LOV already exists`,
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });

  describe('LOV detail [POST /lov/:key/details]', () => {
    it('should create a lov detail', async () => {
      const key = 'prueba'
      const response = await postRequest(`${BASE_URL}/${key}/details`, baseLovDetailDto, 201, true);
      lovDetailId = response.body.payload.id
      expectLovDetailShape(response.body.payload);
    });
  });

  describe('LOV [GET /lov]', () => {
    it('should return a list of lov', async () => {
      const response = await getRequest(BASE_URL, 200, true);
      expect(response.body.payload.data).toHaveLength(11);
      expect(response.body.payload.total).toBe(11);
      expect(response.body.payload.totalPages).toBe(1);
      expectLovShape(response.body.payload.data[0]);
    });
  });

  describe('LOV by key [GET /lov/:key]', () => {
    it('should return a lov by key', async () => {
      const response = await getRequest(`${BASE_URL}/prueba`, 200, true);
      expectLovShape(response.body.payload);
    });

    it('should return error when lov not found', async () => {
      const lovKey = 9999;
      const response = await getRequest(`${BASE_URL}/${lovKey}`, 404, true);
      expect(response.body.error).toEqual({
        message: `LOV with key=${lovKey} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('LOV [PATCH /lov/:id]', () => {
    it('should update a lov', async () => {
      const updateLovDto = {
        ...baseLovDto,
        description: "pruebaaa"
      }
      const response = await patchRequest('/lov/11', updateLovDto, 200, globalThis.accessToken);
      expect(response.body.payload).toEqual(
        expect.objectContaining({
          ...updateLovDto,
          createdAt: expect.any(String),
          createdBy: expect.any(Object),
          updatedAt: expect.any(String),
          updatedBy: expect.any(Object),
        })
      );
    });
  });

  describe('LOV detail [PATCH /lov/details/:id]', () => {
    it('should update a lov detail', async () => {
      const updateLovDto = {
        ...baseLovDetailDto,
        detail: "pruebaaa"
      }
      const response = await patchRequest(`${BASE_URL}/details/${lovDetailId}`, updateLovDto, 200, true);
      expectLovDetailShape(response.body.payload);
    });
  });

  describe('Delete lov by id [DELETE /lov/:id]', () => {
    it('should delete a lov by id', async () => {
      const response = await deleteRequest(`${BASE_URL}/1`, 200, true);
      expect(response.body.payload).toEqual({
        raw: expect.any(Array),
        affected: 1,
      });
    });
  });

  describe('Delete lov detail by id [DELETE /lov/details/:id]', () => {
    it('should delete a lov detail by id', async () => {
      const response = await deleteRequest(`${BASE_URL}/details/${lovDetailId}`, 200, true);
      expect(response.body.payload).toEqual({
        raw: expect.any(Array),
        affected: 1,
      });
    });
  });
});
