import request from 'supertest';

import app from 'src/app';

describe('GET ALL superAdmins', () => {
  test.skip('All superAdmins list status response successful', async () => {
    const response = await request(app).get('/super-admin').send();
    expect(response.statusCode).toBe(200);
  });
});
// describe('POST a superAdmins ', () => {
//   test('All superAdmins list status response successful', async () => {
//     const response = await request(app).get('/super-admin').send({
//       firebaseUid: 'asdasd123123',
//       firstName: 'Thing',
//       lastName: 'Loreal',
//       email: 'distinto2.loreal@radiumrocket.com',
//       isActive: false,
//     });
//     expect(response.statusCode).toBe(201);
//     expect(response.body.message).toBe('Superadmin created');
//   });
// });
