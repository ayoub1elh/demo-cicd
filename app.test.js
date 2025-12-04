import request from 'supertest';
import { app, server } from './app.js';

describe('API Tests', () => {
  afterAll((done) => {
    server.close(done);
  });

  test('GET / returns welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello from Jenkins CI/CD!');
  });

  test('GET /health returns healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});