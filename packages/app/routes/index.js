import express from 'express';
import {assetsRoutes} from './assets.js';
import {documentationRoutes} from './documentation.js';
import {homepageRoutes} from './homepage.js';
import {micropubRoutes} from './micropub.js';
import {sessionRoutes} from './session.js';
import {settingsRoutes} from './settings.js';

const router = express.Router(); // eslint-disable-line new-cap

// Attach routes to router
router.use('/', homepageRoutes);
router.use('/assets', assetsRoutes);
router.use('/docs', documentationRoutes);
router.use('/micropub', micropubRoutes);
router.use('/settings', settingsRoutes);
router.use('/session', sessionRoutes);

export const routes = router;
