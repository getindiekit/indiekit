import test from 'ava';
import {server} from '@indiekit-test/server';

test('Redirects to status page', async t => {
  const request = await server();

  const result = await request.get('/');

  t.is(result.header.location, '/status');
  t.is(result.statusCode, 302);
});
