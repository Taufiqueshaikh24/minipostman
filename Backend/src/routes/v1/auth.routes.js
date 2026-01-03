import express from 'express';
import { signupController, loginController , logoutController } from '../../controllers/auth.controller.js';
import { executeRequestController } from '../../controllers/requestExecution.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Signup route
router.post('/signup', signupController);

// Login route
router.post('/login', loginController);


router.post('/logout', logoutController);





export default router;
