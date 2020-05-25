import test from 'ava';
import supertest from 'supertest';

import app from '../../index.js';
const request = supertest(app);

test('Returns homepage', async t => {
  const response = await request.get('/');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

