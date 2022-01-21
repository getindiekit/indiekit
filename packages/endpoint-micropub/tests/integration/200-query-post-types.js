import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns available post types', async t => {
  const request = await testServer();

  const response = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=post-types');

  t.truthy(response.body['post-types']);
});
