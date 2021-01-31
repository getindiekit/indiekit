import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns categories', async t => {
  const request = await server;

  const response = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=syndicate-to');

  t.truthy(response.body['syndicate-to']);
});
