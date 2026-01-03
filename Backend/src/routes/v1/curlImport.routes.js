import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { importCurlController } from '../../controllers/curlImport.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/curl', importCurlController);

export default router;
