import express from 'express';
import {assetsRoutes} from './assets.js';
import {documentationRoutes} from './documentation.js';
import {sessionRoutes} from './session.js';
import {statusRoutes} from './status.js';

const router = express.Router(); // eslint-disable-line new-cap

export const routes = () => {
  router.use('/', statusRoutes);
  router.use('/assets', assetsRoutes);
  router.use('/docs', documentationRoutes);
  router.use('/session', sessionRoutes);

  return router;
};
