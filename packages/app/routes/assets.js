import express from 'express';
import * as assets from '../controllers/assets.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/app.css', assets.getStyles);

export const assetsRoutes = router;
