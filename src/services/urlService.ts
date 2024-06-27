import { UrlRepository } from '../repositories/urlRepository';
import { EncodeUrlDto } from '../dtos/encodeUrlDto';
import { DecodeUrlDto } from '../dtos/decodeUrlDto';
import { cache } from '../utils/cache';
import { IUrl } from '../models/urlModel';

export class UrlService {
    private urlRepository: UrlRepository;

    constructor() {
        this.urlRepository = new UrlRepository();
    }

    public async encodeUrl(dto: EncodeUrlDto): Promise<string> {
        const { originalUrl } = dto;

        // Generate short URL (simplified example, you'd want to use a real algorithm)
        const shortUrl = Math.random().toString(36).substring(2, 8);

        // Save to database
        const urlDoc = await this.urlRepository.save({ originalUrl, shortUrl, hits: 0 } as IUrl);
        return urlDoc.shortUrl;
    }

    public async decodeUrl(dto: DecodeUrlDto): Promise<string> {
        // Check cache first
        const cachedUrl = await cache.get(dto.shortUrl);
        if (cachedUrl) {
            return cachedUrl;
        }

        // Fetch from database if not in cache
        const urlDoc = await this.urlRepository.findByShortUrl(dto.shortUrl);
        if (!urlDoc) {
            throw new Error('URL not found');
        }

        // Cache the result
        await cache.set(dto.shortUrl, urlDoc.originalUrl, 3600); // Cache for 1 hour
        return urlDoc.originalUrl;
    }

    public async getUrlStatistics(shortUrl: string): Promise<any> {
        const urlDoc = await this.urlRepository.findByShortUrl(shortUrl);
        if (!urlDoc) {
            throw new Error('URL not found');
        }

        return {
            originalUrl: urlDoc.originalUrl,
            shortUrl: urlDoc.shortUrl,
            hits: urlDoc.hits,
        };
    }
}
