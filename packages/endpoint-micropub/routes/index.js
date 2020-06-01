import express from 'express';
import * as micropub from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', micropub.queryEndpoint);

export const micropubRoutes = router;
