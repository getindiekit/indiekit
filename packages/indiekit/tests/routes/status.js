import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

// TODO: Shouldn’t need to set additional settings here
defaultConfig.publication.locale = 'en';
const request = supertest(serverConfig(defaultConfig));

test('Returns status page', async t => {
  const response = await request.get('/');
  t.log(response);
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

