import express from 'express';
import * as session from '../controllers/session.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/login', session.login);

export const sessionRoutes = router;
