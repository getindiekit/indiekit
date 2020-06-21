import express from 'express';
import {assetsRoutes} from './assets.js';
import {documentationRoutes} from './documentation.js';
import {sessionRoutes} from './session.js';
import {shareRoutes} from './share.js';
import {statusRoutes} from './status.js';
import {authenticate} from '../middleware/authentication.js';

const router = express.Router(); // eslint-disable-line new-cap

export const routes = () => {
  router.use('/', statusRoutes);
  router.use('/assets', assetsRoutes);
  router.use('/docs', documentationRoutes);
  router.use('/session', sessionRoutes);
  router.use('/share', authenticate, shareRoutes);

  return router;
};
