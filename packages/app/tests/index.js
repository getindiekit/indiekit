import test from 'ava';
import supertest from 'supertest';

import app from '../index.js';
const request = supertest(app);

test('Returns 404 if resource not found', async t => {
  const response = await request.get('/foobar');
  t.is(response.status, 404);
});
