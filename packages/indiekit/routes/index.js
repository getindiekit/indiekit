import express from 'express';
import frontend from '@indiekit/frontend';
import {assetsRoutes} from './assets.js';
import {homepageRoutes} from './homepage.js';
import {sessionRoutes} from './session.js';
import {statusRoutes} from './status.js';
import {authenticate} from '../middleware/authentication.js';

const {assetsPath} = frontend;
const router = express.Router(); // eslint-disable-line new-cap

export const routes = () => {
  router.use('/', homepageRoutes);
  router.use('/status', authenticate, statusRoutes);
  router.use('/assets', assetsRoutes, express.static(assetsPath));
  router.use('/session', sessionRoutes);

  return router;
};
