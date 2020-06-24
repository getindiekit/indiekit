import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {templates} from '@indiekit/frontend';
import {session} from './session.js';
import * as error from '../middleware/error.js';
import {locals} from '../middleware/locals.js';
import {routes} from '../routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const serverConfig = indiekitConfig => {
  const config = express();
  let views = [];

  // Correctly report secure connections
  config.enable('trust proxy');

  // Body parsers
  config.use(express.json());
  config.use(express.urlencoded({extended: true}));

  // Session
  config.use(session(indiekitConfig));

  // Locals
  config.use(locals(indiekitConfig));

  // Register endpoints
  for (const endpoint of indiekitConfig.application.endpoints) {
    const {application, publication} = indiekitConfig;
    config.use(endpoint.mountpath, endpoint.routes(application, publication));

    if (endpoint.views) {
      views = views.concat(endpoint.views);
    }
  }

  // Views
  views.push(path.join(__dirname, '..', 'views'));
  config.set('views', views);
  config.engine('njk', templates(config).render);
  config.set('view engine', 'njk');

  // Routes
  config.use(routes());

  // Handle errors
  config.use(error.notFound, error.internalServer);

  return config;
};
