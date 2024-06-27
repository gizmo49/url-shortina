import { Router } from 'express';
import { UrlController } from '../controllers/urlController';

const urlController = new UrlController();
const router = Router();

router.use('/url', urlController.router);

export default router;
