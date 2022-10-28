import request from 'supertest';

import app from '../src/service';

describe('Test app.ts', () => {
  test('get health check', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Healthcheck: OK!');
  });

  test('GET_/  - listFiles', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Healthcheck: OK!');
  });
});
