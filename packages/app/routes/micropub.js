import express from 'express';
import * as micropub from '../controllers/micropub.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', micropub.queryEndpoint);

export const micropubRoutes = router;
