/**
 * @swagger
 * components:
 *   schemas:
 *     EncodeUrlDto:
 *       type: object
 *       required:
 *         - originalUrl
 *       properties:
 *         originalUrl:
 *           type: string
 *           description: The original URL to be shortened
 *       example:
 *         originalUrl: https://example.com
 */
export interface EncodeUrlDto {
    originalUrl: string;
  }
  