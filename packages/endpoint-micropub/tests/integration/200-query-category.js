import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns categories', async t => {
  const request = await testServer();

  const response = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=category');

  t.truthy(response.body.categories);
});
