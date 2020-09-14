import express from 'express';
import cookieSession from 'cookie-session';
import i18n from 'i18n';
import {v4 as uuidv4} from 'uuid';
import {templates} from '@indiekit/frontend';
import * as error from '../middleware/error.js';
import {locals} from '../middleware/locals.js';
import {logging} from '../middleware/logging.js';
import {routes} from '../routes/index.js';
import {defaultConfig} from './defaults.js';

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
  i18n.configure({
    cookie: 'locale',
    defaultLocale: 'en',
    indent: '  ',
    objectNotation: true,
    header: defaultConfig.application.locale ? '' : 'accept-language',
    queryParameter: 'lang',
    staticCatalog: defaultConfig.application.locales
  });
  config.use(i18n.init);

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
