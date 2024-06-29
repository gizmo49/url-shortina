import { UrlService } from '../../src/services/urlService';
import { UrlRepository } from '../../src/repositories/urlRepository';
import { cache } from '../../src/utils/cache';
import { IUrl } from '../../src/models/urlModel';
import { EncodeUrlDto } from '../../src/dtos/encodeUrlDto';
import { DecodeUrlDto } from '../../src/dtos/decodeUrlDto';

// Mocking dependencies
jest.mock('../../src/repositories/urlRepository');
jest.mock('../../src/utils/cache');

const UrlRepositoryMock = UrlRepository as jest.Mock<UrlRepository>;
const cacheMock = cache as jest.Mocked<typeof cache>;

describe('UrlService', () => {
    let urlService: UrlService;
    let urlRepositoryMock: jest.Mocked<UrlRepository>;

    beforeEach(() => {
        urlRepositoryMock = new UrlRepositoryMock() as jest.Mocked<UrlRepository>;
        urlService = new UrlService();
        // Injecting mocked repository
        (urlService as any).urlRepository = urlRepositoryMock;
        (urlService as any).baseUrl = `${process.env.BASE_URL}`;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('encodeUrl', () => {
        it('should return cached short URL if it exists in cache', async () => {
            const originalUrl = 'http://example.com';
            const cachedShortUrl = 'abc123';

            cacheMock.get.mockResolvedValueOnce(cachedShortUrl);

            const dto: EncodeUrlDto = { originalUrl };
            const result = await urlService.encodeUrl(dto);

            expect(result).toBe(`${process.env.BASE_URL}/${cachedShortUrl}`);
            expect(cacheMock.get).toHaveBeenCalledWith(originalUrl);
            expect(urlRepositoryMock.save).not.toHaveBeenCalled();
        });

        it('should generate, save, and return new short URL if not in cache', async () => {
            const originalUrl = 'http://example.com';
            const shortUrl = 'abc123';

            cacheMock.get.mockResolvedValueOnce(undefined);
            urlRepositoryMock.save.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 0 } as IUrl);

            jest.spyOn(urlService as any, 'generateShortUrl').mockReturnValue(shortUrl);

            const dto: EncodeUrlDto = { originalUrl };
            const result = await urlService.encodeUrl(dto);

            expect(result).toBe(`${process.env.BASE_URL}/${shortUrl}`);
            expect(cacheMock.get).toHaveBeenCalledWith(originalUrl);
            expect(urlRepositoryMock.save).toHaveBeenCalledWith({ originalUrl, shortUrl, hits: 0 });
            expect(cacheMock.set).toHaveBeenCalledWith(originalUrl, shortUrl, 3600);
        });

        it('should throw an error if saving the URL fails', async () => {
            const originalUrl = 'http://example.com';
            const shortUrl = 'abc123';

            cacheMock.get.mockResolvedValueOnce(undefined);
            urlRepositoryMock.save.mockRejectedValueOnce(new Error()); // Simulate save failure

            jest.spyOn(urlService as any, 'generateShortUrl').mockReturnValue(shortUrl);

            const dto: EncodeUrlDto = { originalUrl };

            await expect(urlService.encodeUrl(dto)).rejects.toThrow('Failed to save the URL');
            expect(cacheMock.get).toHaveBeenCalledWith(originalUrl);
            expect(urlRepositoryMock.save).toHaveBeenCalledWith({ originalUrl, shortUrl, hits: 0 });
            expect(cacheMock.set).not.toHaveBeenCalled();
        });
    });

    describe('decodeUrl', () => {
        it('should return cached original URL if it exists in cache', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            cacheMock.get.mockResolvedValueOnce(originalUrl);

            const dto: DecodeUrlDto = { shortUrl };
            const result = await urlService.decodeUrl(dto);

            expect(result).toBe(originalUrl);
            expect(cacheMock.get).toHaveBeenCalledWith(shortUrl);
            expect(urlRepositoryMock.findByShortUrl).not.toHaveBeenCalled();
        });

        it('should fetch from database, cache, and return original URL if not in cache', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';

            cacheMock.get.mockResolvedValueOnce(undefined);
            urlRepositoryMock.findByShortUrl.mockResolvedValueOnce({ originalUrl, shortUrl, hits: 0 } as IUrl);

            const dto: DecodeUrlDto = { shortUrl };
            const result = await urlService.decodeUrl(dto);

            expect(result).toBe(originalUrl);
            expect(cacheMock.get).toHaveBeenCalledWith(shortUrl);
            expect(urlRepositoryMock.findByShortUrl).toHaveBeenCalledWith(shortUrl);
            expect(cacheMock.set).toHaveBeenCalledWith(shortUrl, originalUrl, 3600);
        });

        it('should throw an error if URL is not found in cache or database', async () => {
            const shortUrl = 'abc123';

            cacheMock.get.mockResolvedValueOnce(undefined);
            urlRepositoryMock.findByShortUrl.mockResolvedValueOnce(null);

            const dto: DecodeUrlDto = { shortUrl };

            await expect(urlService.decodeUrl(dto)).rejects.toThrow('URL not found');
            expect(cacheMock.get).toHaveBeenCalledWith(shortUrl);
            expect(urlRepositoryMock.findByShortUrl).toHaveBeenCalledWith(shortUrl);
            expect(cacheMock.set).not.toHaveBeenCalled();
        });
    });

    describe('getUrlStatistics', () => {
        it('should return the statistics for a given short URL', async () => {
            const shortUrl = 'abc123';
            const originalUrl = 'http://example.com';
            const hits = 5;

            const urlDoc: IUrl = { originalUrl, shortUrl, hits } as IUrl;

            urlRepositoryMock.findByShortUrl.mockResolvedValueOnce(urlDoc);

            const result = await urlService.getUrlStatistics(shortUrl);

            expect(result).toEqual({
                originalUrl,
                shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
                hits,
            });
            expect(urlRepositoryMock.findByShortUrl).toHaveBeenCalledWith(shortUrl);
        });

        it('should throw an error if URL is not found', async () => {
            const shortUrl = 'abc123';

            urlRepositoryMock.findByShortUrl.mockResolvedValueOnce(null);

            await expect(urlService.getUrlStatistics(shortUrl)).rejects.toThrow('URL not found');
            expect(urlRepositoryMock.findByShortUrl).toHaveBeenCalledWith(shortUrl);
        });
    });


});
