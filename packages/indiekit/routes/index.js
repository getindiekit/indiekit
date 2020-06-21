import express from 'express';
import {assetsRoutes} from './assets.js';
import {documentationRoutes} from './documentation.js';
import {homepageRoutes} from './homepage.js';
import {endpointRoutes} from './endpoints.js';
import {sessionRoutes} from './session.js';
import {settingsRoutes} from './settings.js';
import {shareRoutes} from './share.js';
import {authenticate} from '../middleware/authentication.js';

const router = express.Router(); // eslint-disable-line new-cap

// Attach routes to router
router.use('/', homepageRoutes);
router.use('/assets', assetsRoutes);
router.use('/docs', documentationRoutes);
router.use('/', endpointRoutes);
router.use('/session', sessionRoutes);
router.use('/settings', authenticate, settingsRoutes);
router.use('/share', authenticate, shareRoutes);

export const routes = router;
