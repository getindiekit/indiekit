import express from 'express';
import cookieSession from 'cookie-session';
import {templates} from '@indiekit/frontend';
import * as error from '../middleware/error.js';
import {locals} from '../middleware/locals.js';
import {logging} from '../middleware/logging.js';
import {routes} from '../routes/index.js';

export const serverConfig = indiekitConfig => {
  const config = express();

  // Correctly report secure connections
  config.enable('trust proxy');

  // Body parsers
  config.use(express.json());
  config.use(express.urlencoded({extended: true}));

  // Session
  config.use(cookieSession({
    name: indiekitConfig.application.name,
    secret: indiekitConfig.server.secret
  }));

  // Locals
  config.use(locals(indiekitConfig));

  // Log requests
  config.use(logging);

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
