import test from 'ava';
import {server} from '@indiekit-test/server';

test('Redirects unauthorized user to login page', async t => {
  const request = await server;

  const result = await request.get('/status');

  t.is(result.statusCode, 302);
});
