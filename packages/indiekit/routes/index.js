import express from 'express';
import {assetsPath} from '@indiekit/frontend';
import {assetsRoutes} from './assets.js';
import {sessionRoutes} from './session.js';
import {statusRoutes} from './status.js';

const router = express.Router(); // eslint-disable-line new-cap

export const routes = () => {
  router.use('/', statusRoutes);
  router.use('/assets', assetsRoutes, express.static(assetsPath));
  router.use('/session', sessionRoutes);

  return router;
};
