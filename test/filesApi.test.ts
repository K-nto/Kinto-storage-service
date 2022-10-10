import request from 'supertest';

import app from '../src/service';

describe('Test app.ts', () => {
  test('get health check', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Healthcheck: OK!');
  });
});
