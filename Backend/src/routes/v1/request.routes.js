import express from 'express';
import {
  saveRequestController,
  getRequestsController,
  deleteRequestController,
} from '../../controllers/request.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { executeRequestController , getExecutionsController } from '../../controllers/requestExecution.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', saveRequestController);
router.get('/', getRequestsController);
router.delete('/:id', deleteRequestController);

// This is execute route 
router.post('/:id/execute', authMiddleware, executeRequestController);


router.get('/:id/executions' , authMiddleware , getExecutionsController)
export default router;
