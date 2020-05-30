import test from 'ava';
import supertest from 'supertest';

import app from '../../index.js';
const request = supertest(app);

test('Returns homepage', async t => {
  const response = await request.get('/session/login');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Submits login and validates URL', async t => {
  const response = await request.post('/session/login')
    .send('me=foobar');
  t.is(response.status, 422);
});

test('Submits login and redirects to settings page', async t => {
  const response = await request.post('/session/login')
    .send('me=https://example.org');
  t.is(response.status, 302);
});
