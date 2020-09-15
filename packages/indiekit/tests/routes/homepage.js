import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

const request = supertest(serverConfig(defaultConfig));

test('Logged out users redirected to login page', async t => {
  const response = await request.get('/');
  t.is(response.status, 302);
});

