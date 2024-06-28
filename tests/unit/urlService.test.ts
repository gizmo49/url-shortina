import { UrlService } from '../../src/services/urlService';
import { UrlRepository } from '../../src/repositories/urlRepository';
import { cache } from '../../src/utils/cache';
import { IUrl } from '../../src/models/urlModel';

jest.mock('../../src/repositories/urlRepository');
jest.mock('../../src/utils/cache');

const mockUrlRepository = new UrlRepository() as jest.Mocked<UrlRepository>;
const mockCache = cache as jest.Mocked<typeof cache>;

describe('UrlService', () => {
    let urlService: UrlService;

    beforeEach(() => {
        urlService = new UrlService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('encodeUrl', () => {
        it('should encode a URL and return the shortened URL', async () => {
            const originalUrl = 'http://example.com';
            const shortUrl = 'abc123';
            const expectedShortUrl = `http://localhost:3000/${shortUrl}`;

            mockCache.get.mockResolvedValueOnce(undefined);
            mockUrlRepository.save.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 0 } as IUrl);

            const result = await urlService.encodeUrl({ originalUrl });

            expect(result).toBe(expectedShortUrl);
            expect(mockCache.set).toHaveBeenCalledWith(originalUrl, expectedShortUrl, 3600);
            expect(mockUrlRepository.save).toHaveBeenCalledWith({ originalUrl, shortUrl, hits: 0 });
        });
    });

    describe('decodeUrl', () => {
        it('should decode a short URL and return the original URL from cache', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            mockCache.get.mockResolvedValueOnce(originalUrl);

            const result = await urlService.decodeUrl({ shortUrl });

            expect(result).toBe(originalUrl);
        });

        it('should decode a short URL and return the original URL from database if not in cache', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            mockCache.get.mockResolvedValueOnce(undefined);
            mockUrlRepository.findByShortUrl.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 0 } as IUrl);

            const result = await urlService.decodeUrl({ shortUrl });

            expect(result).toBe(originalUrl);
            expect(mockCache.set).toHaveBeenCalledWith(shortUrl, originalUrl, 3600);
        });
    });

    describe('getUrlStatistics', () => {
        it('should return the statistics for a given short URL', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            mockUrlRepository.findByShortUrl.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 10 } as IUrl);

            const result = await urlService.getUrlStatistics(shortUrl);

            expect(result).toEqual({
                originalUrl,
                shortUrl,
                hits: 10,
            });
        });
    });
});
