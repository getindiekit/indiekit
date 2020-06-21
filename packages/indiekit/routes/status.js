import express from 'express';
import * as statusController from '../controllers/status.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', statusController.viewStatus);

export const statusRoutes = router;
