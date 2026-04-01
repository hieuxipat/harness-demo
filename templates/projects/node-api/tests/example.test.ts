import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/health', () => {
    it('should return status ok', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect({ status: 'ok' });
    });
  });

  describe('GET /api/examples', () => {
    it('should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/examples')
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual([]);
        });
    });
  });

  describe('POST /api/examples', () => {
    it('should create a new example', () => {
      return request(app.getHttpServer())
        .post('/api/examples')
        .send({ name: 'Test Example' })
        .expect(201)
        .then((res) => {
          expect(res.body.data.name).toBe('Test Example');
        });
    });
  });
});
