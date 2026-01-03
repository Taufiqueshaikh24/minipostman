import express from 'express';
import {
  createEnvironmentController,
  getEnvironmentsController,
  getEnvironmentController,
  deleteEnvironmentController,
} from '../../controllers/environment.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createEnvironmentController);
router.get('/', getEnvironmentsController);
router.get('/:id', getEnvironmentController);
router.delete('/:id', deleteEnvironmentController);

export default router;
