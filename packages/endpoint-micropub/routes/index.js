import express from 'express';
import query from '../controllers/query.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', query);

export const micropubRoutes = router;
