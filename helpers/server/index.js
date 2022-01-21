import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import supertest from 'supertest';
import {testConfig} from '@indiekit-test/config';
import {expressConfig} from '@indiekit/indiekit/config/express.js';

export const server = async options => {
  const config = await testConfig(options);
  const server = supertest(expressConfig(config));
  return server;
};
