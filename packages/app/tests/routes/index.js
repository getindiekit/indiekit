import test from 'ava';
import supertest from 'supertest';

import app from '../../index.js';
const request = supertest(app);

test('Returns CSS', async t => {
  const response = await request.get('/app.css');
  t.is(response.status, 200);
  t.is(response.type, 'text/css');
});

test('Returns 404 as HTML', async t => {
  const response = await request.get('/foobar');
  t.is(response.status, 404);
  t.is(response.type, 'text/html');
});

test('Returns 404 as text', async t => {
  const response = await request.get('/foobar')
    .set('Accept', 'application/json');
  t.is(response.status, 404);
  t.is(response.type, 'text/plain');
});
