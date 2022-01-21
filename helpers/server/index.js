import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import supertest from 'supertest';
import {testConfig} from '@indiekit-test/config';
import {serverConfig} from '@indiekit/indiekit/config/server.js';

export const server = async options => {
  const config = await testConfig(options);
  const server = supertest(serverConfig(config));
  return server;
};
