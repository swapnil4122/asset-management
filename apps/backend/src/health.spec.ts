import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

describe('HealthCheck (e2e-lite)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    it('should pass a basic truthy test', () => {
        expect(true).toBe(true);
    });

    afterAll(async () => {
        await app.close();
    });
});
