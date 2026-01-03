import express from 'express';
import authRoutes from './auth.routes.js';
import requestRoutes from './request.routes.js';
import collectionRoutes from "./collection.routes.js"
import environmentRoutes from "./enviroment.routes.js"
import curlImportRoutes  from './curlImport.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/collections' , collectionRoutes)
router.use('/environments', environmentRoutes);
router.use('/import' , curlImportRoutes)

export default router;
