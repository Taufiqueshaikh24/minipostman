import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import {
  createCollectionController,
  getCollectionsController,
  deleteCollectionController,
} from '../../controllers/collection.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createCollectionController);
router.get('/', authMiddleware, getCollectionsController);
router.delete('/:id', authMiddleware, deleteCollectionController);

export default router;
