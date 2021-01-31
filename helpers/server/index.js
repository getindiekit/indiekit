import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import supertest from 'supertest';
import {indiekitConfig} from '@indiekit-test/config';
import {serverConfig} from '../../packages/indiekit/config/server.js';

export const server = (async () => {
  const server = supertest(serverConfig(await indiekitConfig));
  return server;
})();
