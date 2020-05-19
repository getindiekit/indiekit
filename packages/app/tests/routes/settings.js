import test from 'ava';
import supertest from 'supertest';

import app from '../../index.js';
const request = supertest(app);

test('Returns application settings', async t => {
  const response = await request.get('/settings');
  t.is(response.status, 200);
  t.is(response.body.name, 'IndieKit');
});
