import test from 'ava';
import supertest from 'supertest';

import app from '../../index.js';
const request = supertest(app);

test('Returns documentation', async t => {
  const response = await request.get('/docs/en/');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Returns 404', async t => {
  const response = await request.get('/docs/not-found');
  t.is(response.status, 404);
});
