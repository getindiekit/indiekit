import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import supertest from 'supertest';
import {indiekitConfig} from '@indiekit-test/config';
import {serverConfig} from '@indiekit/indiekit/config/server.js';

export const server = async options => {
  const server = supertest(serverConfig(await indiekitConfig(options)));
  return server;
};
