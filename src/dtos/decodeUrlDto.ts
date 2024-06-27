/**
 * @swagger
 * components:
 *   schemas:
 *     DecodeUrlDto:
 *       type: object
 *       required:
 *         - shortUrl
 *       properties:
 *         shortUrl:
 *           type: string
 *           description: The shortened URL to be decoded
 *       example:
 *         shortUrl: http://short.ly/abcd12
 */
export interface DecodeUrlDto {
    shortUrl: string;
  }
  