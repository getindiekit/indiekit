import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

const request = supertest(serverConfig(defaultConfig));

test('Returns status page', async t => {
  const response = await request.get('/');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

