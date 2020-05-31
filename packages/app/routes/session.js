import express from 'express';
import * as session from '../controllers/session.js';
import * as validate from '../middleware/validation.js';

const router = express.Router(); // eslint-disable-line new-cap

// Log in
router.get('/login', session.login);
router.post('/login', validate.me, session.authenticate);

// Authentication
router.get('/auth', session.authenticationCallback);

export const sessionRoutes = router;
