import request from 'supertest';

import app from '../../app';

describe('GET /user', () => {
  test.skip('It should get the user list', async () => {
    const response = await request(app).get('/user');
    expect(response.body.message).toBe('Showing Users.');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
  });
});
