import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 404', async t => {
  const request = await server;

  const result = await request.get('/not-found');

  t.is(result.statusCode, 404);
});
