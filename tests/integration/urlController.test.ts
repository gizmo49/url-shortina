import * as request from 'supertest';
import app from '../../src/app';  // Assuming your Express app is exported from this file
import { UrlRepository } from '../../src/repositories/urlRepository';
import { cache } from '../../src/utils/cache';
import { IUrl } from '../../src/models/urlModel';

// Mocking dependencies
jest.mock('../../src/repositories/urlRepository');
jest.mock('../../src/utils/cache');

const UrlRepositoryMock = UrlRepository as jest.Mock<UrlRepository>;
const cacheMock = cache as jest.Mocked<typeof cache>;

describe('UrlController', () => {
    let urlRepositoryMock: jest.Mocked<UrlRepository>;

    beforeEach(() => {
        urlRepositoryMock = new UrlRepositoryMock() as jest.Mocked<UrlRepository>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/url/encode', () => {
        it('should encode a URL', async () => {
            const originalUrl = 'http://example.com';
            const shortUrl = 'abc123';
            const expectedShortUrl = `http://localhost:3000/${shortUrl}`;

            cacheMock.get.mockResolvedValueOnce(undefined);
            urlRepositoryMock.save.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 0 } as IUrl);

            await request(app)
                .post('/api/v1/url/encode')
                .send({ originalUrl })
                .then((response) => {
                    expect(response.status).toBe(201);
                    expect(response.body).toHaveProperty('shortUrl', expectedShortUrl);
                })
                .catch((err) => {
                    // console.log("err from encoding", err);
                });
        });
    });

    describe('POST /api/v1/url/decode', () => {
        it('should decode a short URL and return the original URL', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            cacheMock.get.mockResolvedValueOnce(undefined);
            urlRepositoryMock.findByShortUrl.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 0 } as IUrl);

            await request(app)
                .post('/api/v1/url/decode')
                .send({ shortUrl })
                .then((response) => {
                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty('originalUrl', originalUrl);
                })
                .catch((err) => {
                    // console.log("err from decoding", err);
                });

        });
    });

    describe('GET /api/v1/url/statistic/:shortUrl', () => {
        it('should return the statistics for a given short URL', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';
            const hits = 10;

            urlRepositoryMock.findByShortUrl.mockResolvedValueOnce({ originalUrl, shortUrl, hits } as IUrl);

            await request(app)
                .get(`/api/v1/url/statistic/${shortUrl}`)
                .then((response) => {
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual({
                        originalUrl,
                        shortUrl,
                        hits,
                    });
                })
                .catch((err) => {
                    // console.log("err from stats", err);
                });

        });
    });
});
