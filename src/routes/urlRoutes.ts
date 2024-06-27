import { Router } from 'express';
import { UrlController } from '../controllers/urlController';

const router = Router();
const urlController = new UrlController();

/**
 * @swagger
 * tags:
 *   name: URL
 *   description: URL management
 */

/**
 * @swagger
 * /encode:
 *   post:
 *     summary: Encodes a URL to a shortened URL
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EncodeUrlDto'
 *     responses:
 *       201:
 *         description: The shortened URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL
 */
router.post('/encode', urlController.encode);

/**
 * @swagger
 * /decode:
 *   post:
 *     summary: Decodes a shortened URL to its original URL
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DecodeUrlDto'
 *     responses:
 *       200:
 *         description: The original URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalUrl:
 *                   type: string
 *                   description: The original URL
 */
router.post('/decode', urlController.decode);

/**
 * @swagger
 * /statistic/{urlPath}:
 *   get:
 *     summary: Return basic statistics of a short URL path
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: urlPath
 *         schema:
 *           type: string
 *         required: true
 *         description: The short URL path
 *     responses:
 *       200:
 *         description: The URL statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalUrl:
 *                   type: string
 *                   description: The original URL
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL
 *                 hits:
 *                   type: number
 *                   description: Number of times the URL has been accessed
 */
router.get('/statistic/:urlPath', urlController.statistic);

export default router;
