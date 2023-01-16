import request from 'supertest';

import app from '../../app';

describe('GET ALL superAdmins', () => {
  test.skip('All superAdmins list status response successful', async () => {
    const response = await request(app).get('/super-admin').send();
    expect(response.statusCode).toBe(200);
  });
});
