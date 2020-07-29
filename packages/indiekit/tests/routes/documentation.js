import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

const request = supertest(serverConfig(defaultConfig));

test('Returns documentation', async t => {
  const response = await request.get('/docs/en/');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Redirects to English documentation', async t => {
  const response = await request.get('/docs/de/');
  t.is(response.status, 302);
});

test('Returns 404', async t => {
  const response = await request.get('/docs/en/not-found');
  t.is(response.status, 404);
  t.is(response.type, 'text/html');
});
