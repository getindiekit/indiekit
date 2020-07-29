import express from 'express';
import * as documentationController from '../controllers/documentation.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get(['/:locale', '/:locale/*'], documentationController.viewDocument);

export const documentationRoutes = router;
