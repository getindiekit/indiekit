import express from 'express';
import {assetsRoutes} from './assets.js';
import {documentationRoutes} from './documentation.js';
import {homepageRoutes} from './homepage.js';
import {micropubRoutes} from '@indiekit/endpoint-micropub/routes/index.js';
import {sessionRoutes} from './session.js';
import {settingsRoutes} from './settings.js';
import {shareRoutes} from './share.js';
import {authenticate} from '../middleware/authentication.js';

const router = express.Router(); // eslint-disable-line new-cap

// Attach routes to router
router.use('/', homepageRoutes);
router.use('/assets', assetsRoutes);
router.use('/docs', documentationRoutes);
router.use('/micropub', micropubRoutes);
router.use('/settings', authenticate, settingsRoutes);
router.use('/session', sessionRoutes);
router.use('/share', shareRoutes);

export const routes = router;
