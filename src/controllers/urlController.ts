import { Request, Response, Router } from 'express';
import { UrlService } from '../services/urlService';
import { EncodeUrlDto } from '../dtos/encodeUrlDto';
import { DecodeUrlDto } from '../dtos/decodeUrlDto';
import { validate } from '../utils/validation';
import { encodeUrlSchema, decodeUrlSchema } from '../schemas/url.schema';

export class UrlController {
    public router: Router;
    private urlService: UrlService;

    constructor() {
        this.router = Router();
        this.urlService = new UrlService();
        this.routes();
    }

    private routes() {
        /**
         * @swagger
         * /url/encode:
         *   post:
         *     summary: Encodes a URL to a shortened URL
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/EncodeUrlDto'
         *     responses:
         *       201:
         *         description: Successfully encoded URL
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 shortUrl:
         *                   type: string
         */
        this.router.post('/encode', this.encodeUrl.bind(this));

        /**
         * @swagger
         * /url/decode:
         *   post:
         *     summary: Decodes a shortened URL to its original URL
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DecodeUrlDto'
         *     responses:
         *       200:
         *         description: Successfully decoded URL
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 originalUrl:
         *                   type: string
         */
        this.router.post('/decode', this.decodeUrl.bind(this));

        /**
         * @swagger
         * /url/statistic/{urlPath}:
         *   get:
         *     summary: Return basic statistics of a short URL path
         *     parameters:
         *       - in: path
         *         name: urlPath
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Successfully retrieved statistics
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 originalUrl:
         *                   type: string
         *                 shortUrl:
         *                   type: string
         *                 hits:
         *                   type: number
         */
        this.router.get('/statistic/:urlPath', this.getUrlStatistics.bind(this));
    }

    private async encodeUrl(req: Request, res: Response): Promise<void> {
        try {
            const dto: EncodeUrlDto = req.body;
            await validate(dto, encodeUrlSchema);
            const shortUrl = await this.urlService.encodeUrl(dto);
            res.status(201).json({ shortUrl });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'An error occurred' });
            }
        }

    }

    private async decodeUrl(req: Request, res: Response): Promise<void> {
        try {
            const dto: DecodeUrlDto = req.body;
            await validate(dto, decodeUrlSchema);
            const originalUrl = await this.urlService.decodeUrl(dto);
            res.status(200).json({ originalUrl });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'An error occurred' });
            }
        }

    }

    private async getUrlStatistics(req: Request, res: Response): Promise<void> {
        try {
            const { urlPath } = req.params;
            const stats = await this.urlService.getUrlStatistics(urlPath);
            res.status(200).json(stats);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'An error occurred' });
            }
        }

    }
}
