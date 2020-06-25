import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

const request = supertest(serverConfig(defaultConfig));

test('Returns login page', async t => {
  const response = await request.get('/session/login');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Login validates URL', async t => {
  const response = await request.post('/session/login')
    .send('me=foobar');
  t.is(response.status, 422);
});

test('Login returns 401 if URL is unauthorized', async t => {
  const response = await request.post('/session/login')
    .send('me=example.website');
  t.is(response.status, 401);
});

test.skip('Login redirects to authentication service', async t => {
  // TODO: Make request and response to mocked endpoint
  const response = await request.post('/session/login')
    .send('me=paulrobertlloyd.github.io/indiekit-sandbox');
  t.regex(response.headers.location, /\bhttps:\/\/indieauth.com\/auth\b/);
  t.is(response.status, 302);
});

test('Auth callback returns 403 if user is forbidden access', async t => {
  const response = await request.get('/session/auth')
    .send('code=foobar');
  t.is(response.status, 403);
});

test('Logout redirects to homepage', async t => {
  const response = await request.get('/session/logout');
  t.is(response.status, 302);
});
