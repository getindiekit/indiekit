import express from 'express';
import * as assetsController from '../controllers/assets.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/app.css', assetsController.getStyles);

export const assetsRoutes = router;
