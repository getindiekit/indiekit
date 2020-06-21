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
  config.set('views', path.join(`${__dirname}`, '..', 'views'));
  config.engine('njk', templates(config).render);
  config.set('view engine', 'njk');

  // Endpoints
  for (const endpoint of indiekitConfig.application.endpoints) {
    const {publication} = indiekitConfig;
    config.use(endpoint.mountpath, endpoint.routes(publication));
  }

  // Routes
  config.use(routes());

  // Handle errors
  config.use(error.notFound, error.internalServer);

  return config;
};
