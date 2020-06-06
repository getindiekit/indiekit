import express from 'express';
import * as sessionController from '../controllers/session.js';
import * as validate from '../middleware/validation.js';

const router = express.Router(); // eslint-disable-line new-cap

// Log in
router.get('/login', sessionController.login);
router.post('/login', validate.me, sessionController.authenticate);

// Authentication callback
router.get('/auth', sessionController.authenticationCallback);

// Log out
router.get('/logout', sessionController.logout);

export const sessionRoutes = router;
