import express from 'express';
import {templates} from '@indiekit/frontend';
import {session} from './session.js';
import * as error from '../middleware/error.js';
import {locals} from '../middleware/locals.js';
import {routes} from '../routes/index.js';

export const serverConfig = indiekitConfig => {
  const config = express();

  // Correctly report secure connections
  config.enable('trust proxy');

  // Body parsers
  config.use(express.json());
  config.use(express.urlencoded({extended: true}));

  // Session
  config.use(session(indiekitConfig));

  // Locals
  config.use(locals(indiekitConfig));

  // Views
  config.set('views', indiekitConfig.application.views);
  config.engine('njk', templates(config).render);
  config.set('view engine', 'njk');

  // Endpoint routes
  for (const route of indiekitConfig.application.routes) {
    config.use(route.mountpath, route.routes());
  }

  // Routes
  config.use(routes());

  // Handle errors
  config.use(error.notFound, error.internalServer);

  return config;
};
