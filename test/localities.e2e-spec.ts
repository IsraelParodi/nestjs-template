
import * as request from 'supertest';
import { LocalitiesController } from '@localities/presenters/http/localities.controller';

const expectedCountryShape = {
  id: expect.any(Number),
  name: expect.any(String),
  iso3: expect.any(String),
  numericCode: expect.any(String),
  iso2: expect.any(String),
  phoneCode: expect.any(String),
  capital: expect.any(String),
  currency: expect.any(String),
  currencyName: expect.any(String),
  currencySymbol: expect.any(String),
  tld: expect.any(String),
  native: expect.any(String),
  region: expect.any(String),
  regionId: expect.any(Number),
  subregion: expect.any(String),
  subregionId: expect.any(Number),
  nationality: expect.any(String),
  timezones: expect.any(String),
  translations: expect.any(String),
  latitude: expect.any(String),
  longitude: expect.any(String),
  emoji: expect.any(String),
  emojiU: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  flag: expect.any(Number),
  wikiDataId: expect.any(String),
};

const expectedStateShape = {
  id: expect.any(Number),
  name: expect.any(String),
  countryId: expect.any(Number),
  countryCode: expect.any(String),
  fipsCode: expect.any(String),
  iso2: expect.any(String),
  type: expect.any(String),
  latitude: expect.any(String),
  longitude: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  flag: expect.any(Number),
  wikiDataId: expect.any(String),
};

async function getRequest(path: string, expectedStatus = 200) {
  return request(globalThis.app.getHttpServer()).get(path).expect(expectedStatus);
}

function expectCountryPayload(payload: any) {
  expect(payload).toMatchObject(expectedCountryShape);
}

function expectStatePayload(payload: any) {
  expect(payload).toMatchObject(expectedStateShape);
}

function expectPaginatedCountries(response: any) {
  expect(response.body.payload.data).toHaveLength(10);
  expect(response.body.payload.total).toBe(250);
  expect(response.body.payload.totalPages).toBe(25);
  expectCountryPayload(response.body.payload.data[0]);
}

describe('[Feature] - Localities - /localities', () => {
  describe('Countries from Memory [GET /localities/countries]', () => {
    it('should return a list of countries from memory', async () => {
      const response = await getRequest('/localities/countries');
      expectPaginatedCountries(response);
    });

    it('should return a country from memory', async () => {
      const response = await getRequest('/localities/countries/1');
      expectCountryPayload(response.body.payload);
    });

    it('country not found in memory', async () => {
      const countryId = 999999;
      const response = await getRequest(`/localities/countries/${countryId}`, 404);
      expect(response.body.error).toMatchObject({ message: `Country with ID ${countryId} not found` });
    });
  });

  describe('Countries from Database [GET /localities/countries]', () => {
    beforeAll(() => {
      const localitiesController = globalThis.app.get(LocalitiesController);
      localitiesController.resetCountries();
    });

    it('should return a list of countries from database', async () => {
      const response = await getRequest('/localities/countries');
      expectPaginatedCountries(response);
    });

    it('should return a country from database', async () => {
      const response = await getRequest('/localities/countries/1');
      expectCountryPayload(response.body.payload);
    });

    it('should return an error not found when send invalid ID', async () => {
      const countryCode = 999999;
      const response = await getRequest(`/localities/countries/${countryCode}`, 404);
      expect(response.body.error).toMatchObject({
        message: `Country with ID ${countryCode} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('States from country [GET /localities/countries/:id/states]', () => {
    it('should return a list of states from Peru', async () => {
      const countryCode = 173;
      const response = await getRequest(`/localities/countries/${countryCode}/states`);
      expect(response.body.payload.data).toHaveLength(25);
      expect(response.body.payload.total).toBe(25);
      expect(response.body.payload.totalPages).toBe(null);
      expectStatePayload(response.body.payload.data[0]);
    });
  });

  describe('State by id from country [GET /localities/countries/:id/states/:idState]', () => {
    it('should return a state from Peru', async () => {
      const countryCode = 173;
      const stateCode = 3678;
      const response = await getRequest(`/localities/countries/${countryCode}/states/${stateCode}`);
      expect(response.body.payload).toMatchObject({
        id: stateCode,
        name: 'Madre de Dios',
        countryId: countryCode,
        countryCode: 'PE',
        type: 'region',
      });
    });

    it('should return an error not found', async () => {
      const countryCode = 173;
      const stateCode = 9999999;
      const response = await getRequest(`/localities/countries/${countryCode}/states/${stateCode}`, 404);
      expect(response.body.error).toMatchObject({
        message: `State with ID ${stateCode} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });
});
