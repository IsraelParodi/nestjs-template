
import * as request from 'supertest';

export function getRequest(path: string, expectedStatus = 200, auth = false) {
    const req = request(globalThis.app.getHttpServer()).get(path);
    if (auth) req.set('Authorization', `Bearer ${globalThis.accessToken}`);
    return req.expect(expectedStatus);
}

export function postRequest(path: string, body: any, expectedStatus = 201, auth = false) {
    const req = request(globalThis.app.getHttpServer()).post(path).send(body);
    if (auth) req.set('Authorization', `Bearer ${globalThis.accessToken}`);
    return req.expect(expectedStatus);
}

export function patchRequest(path: string, body: any, expectedStatus = 200, auth = false) {
    const req = request(globalThis.app.getHttpServer()).patch(path).send(body)
    if (auth) req.set('Authorization', `Bearer ${globalThis.accessToken}`);
    return req.expect(expectedStatus);
}

export function deleteRequest(path: string, expectedStatus = 200, auth = false) {
    const req = request(globalThis.app.getHttpServer()).delete(path)
    if (auth) req.set('Authorization', `Bearer ${globalThis.accessToken}`);
    return req.expect(expectedStatus);
}