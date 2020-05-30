import express from 'express';
import * as session from '../controllers/session.js';
import * as validate from '../middleware/validation.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/login', session.login);
router.post('/login', validate.me, session.authenticate);

export const sessionRoutes = router;
