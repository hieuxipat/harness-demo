import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/examples', () => {
  it('should return empty array initially', async () => {
    const res = await request(app).get('/api/examples');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('POST /api/examples', () => {
  it('should create a new example', async () => {
    const res = await request(app)
      .post('/api/examples')
      .send({ name: 'Test Example' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test Example');
  });
});
