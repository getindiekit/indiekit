import express from 'express';
import cookieSession from 'cookie-session';
import {v4 as uuidv4} from 'uuid';
import frontend from '@indiekit/frontend';
import * as error from '../lib/middleware/error.js';
import {internationalisation} from '../lib/middleware/internationalisation.js';
import {locals} from '../lib/middleware/locals.js';
import {logging} from '../lib/middleware/logging.js';
import {routes} from '../lib/routes.js';

const {templates} = frontend;

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
    secret: uuidv4()
  }));

  // Internationalisation
  config.use(internationalisation(indiekitConfig));

  // Locals
  config.use(locals(indiekitConfig));

  // Log requests
  config.use(logging);

  // Views
  config.set('views', indiekitConfig.application.views);
  config.engine('njk', templates(config).render);
  config.set('view engine', 'njk');

  // Routes
  config.use(routes(indiekitConfig));

  // Handle errors
  config.use(error.notFound, error.internalServer);

  return config;
};
