import test from 'ava';
import supertest from 'supertest';

import app from '../../index.js';
const request = supertest(app);

test('Returns homepage', async t => {
  const response = await request.get('/session/login');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Login validates URL', async t => {
  const response = await request.post('/session/login')
    .send('me=foobar');
  t.is(response.status, 422);
});

test('Login URL is unauthorized', async t => {
  const response = await request.post('/session/login')
    .send('me=example.website');
  t.is(response.status, 401);
});

test('Login redirects to authentication service', async t => {
  // TODO: Mock request to, and response from, fake endpoint
  const response = await request.post('/session/login')
    .send('me=paulrobertlloyd.github.io/indiekit-sandbox');
  t.regex(response.headers.location, /\bhttps:\/\/indieauth.com\/auth\b/);
  t.is(response.status, 302);
});
