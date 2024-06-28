import request from 'supertest';
import app from '../../src/app'; 
import { UrlRepository } from '../../src/repositories/urlRepository';
import { cache } from '../../src/utils/cache';
import { IUrl } from '../../src/models/urlModel';

jest.mock('../../src/repositories/urlRepository');
jest.mock('../../src/utils/cache');

const mockUrlRepository = new UrlRepository() as jest.Mocked<UrlRepository>;
const mockCache = cache as jest.Mocked<typeof cache>;

describe('UrlController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /encode', () => {
        it('should encode a URL', async () => {
            const originalUrl = 'http://example.com';
            const shortUrl = 'abc123';
            const expectedShortUrl = `http://localhost:3000/${shortUrl}`;

            mockCache.get.mockResolvedValueOnce(undefined);
            mockUrlRepository.save.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 0 } as IUrl);

            const response = await request(app)
                .post('/encode')
                .send({ originalUrl });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('shortUrl', expectedShortUrl);
        });
    });

    describe('POST /decode', () => {
        it('should decode a short URL and return the original URL', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            mockCache.get.mockResolvedValueOnce(originalUrl);

            const response = await request(app)
                .post('/decode')
                .send({ shortUrl });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('originalUrl', originalUrl);
        });
    });

    describe('GET /statistic/:shortUrl', () => {
        it('should return the statistics for a given short URL', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            mockUrlRepository.findByShortUrl.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 10 } as IUrl);

            const response = await request(app).get(`/statistic/${shortUrl}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                originalUrl,
                shortUrl,
                hits: 10,
            });
        });
    });
});
